import { storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { Alert } from 'react-native';

// Upload photo to Firebase Storage
export const uploadPhotoToCloud = async (imageUri, contributorName) => {
  try {
    // Create unique filename
    const timestamp = new Date().toISOString();
    const fileName = `wedding-photos/${timestamp}-${contributorName.replace(/\s+/g, '-')}.jpg`;
    
    // Convert image URI to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Create storage reference
    const storageRef = ref(storage, fileName);
    
    // Upload the blob
    const snapshot = await uploadBytes(storageRef, blob);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    const cloudPhoto = {
      id: `${Date.now()}-${Math.random()}`,
      downloadURL,
      contributorName,
      timestamp: new Date().toLocaleString(),
      fileName: snapshot.ref.name
    };
    
    return cloudPhoto;
    
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
};

// Download all photos from Firebase Storage
export const getAllPhotosFromCloud = async () => {
  try {
    const photosRef = ref(storage, 'wedding-photos/');
    const result = await listAll(photosRef);
    
    const photos = [];
    
    for (const itemRef of result.items) {
      try {
        const downloadURL = await getDownloadURL(itemRef);
        
        // Extract metadata from filename
        const fileName = itemRef.name;
        const parts = fileName.split('-');
        
        let contributorName = 'Unknown Guest';
        let timestamp = 'Unknown time';
        
        if (parts.length >= 3) {
          // Remove file extension and reconstruct name
          const namePart = parts.slice(1, -1).join('-').replace('.jpg', '');
          contributorName = namePart.replace(/-/g, ' ');
          timestamp = parts[0];
        }
        
        photos.push({
          id: fileName,
          downloadURL,
          contributorName,
          timestamp: new Date(timestamp).toLocaleString(),
          fileName
        });
        
      } catch (itemError) {
        console.warn('Error processing photo:', itemError);
      }
    }
    
    // Sort by timestamp (newest first)
    return photos.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
  } catch (error) {
    console.error('Error fetching photos from cloud:', error);
    return [];
  }
};

// Get photos count for stats
export const getCloudPhotosCount = async () => {
  try {
    const photosRef = ref(storage, 'wedding-photos/');
    const result = await listAll(photosRef);
    return result.items.length;
  } catch (error) {
    console.error('Error getting photos count:', error);
    return 0;
  }
}; 