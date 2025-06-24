import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUUID } from './utils';

interface Photo {
  id: string;
  uri: string;
  contributorName: string;
  timestamp: string;
  localPath?: string;
}

interface PhotoManagerProps {
  onPhotoAdded?: (photo: Photo) => void;
}

export default function PhotoManager({ onPhotoAdded }: PhotoManagerProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [contributorName, setContributorName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadPhotos();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    // Request camera permissions
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraStatus !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
    }

    // Request media library permissions
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaStatus !== 'granted') {
      Alert.alert('Permission needed', 'Media library permission is required to select photos');
    }
  };

  const loadPhotos = async () => {
    try {
      const storedPhotos = await AsyncStorage.getItem('wedding_photos');
      if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  };

  const savePhotos = async (newPhotos: Photo[]) => {
    try {
      await AsyncStorage.setItem('wedding_photos', JSON.stringify(newPhotos));
      setPhotos(newPhotos);
    } catch (error) {
      console.error('Error saving photos:', error);
    }
  };

  const savePhotoToDevice = async (uri: string): Promise<string> => {
    try {
      // Create a unique filename
      const filename = `wedding_photo_${Date.now()}.jpg`;
      const documentDirectory = FileSystem.documentDirectory;
      const localPath = `${documentDirectory}WeddingPhotos/${filename}`;
      
      // Ensure directory exists
      const dirInfo = await FileSystem.getInfoAsync(`${documentDirectory}WeddingPhotos/`);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(`${documentDirectory}WeddingPhotos/`, { intermediates: true });
      }
      
      // Copy the image to our app's directory
      await FileSystem.copyAsync({
        from: uri,
        to: localPath,
      });
      
      return localPath;
    } catch (error) {
      console.error('Error saving photo to device:', error);
      return uri; // Return original URI if saving fails
    }
  };

  const addPhoto = async (imageUri: string) => {
    if (!contributorName.trim()) {
      Alert.alert('Name Required', 'Please enter your name before adding a photo');
      return;
    }

    setIsUploading(true);

    try {
      // Save photo to device storage
      const localPath = await savePhotoToDevice(imageUri);
      
      const newPhoto: Photo = {
        id: generateUUID(),
        uri: imageUri,
        localPath,
        contributorName: contributorName.trim(),
        timestamp: new Date().toLocaleString(),
      };

      const updatedPhotos = [...photos, newPhoto];
      await savePhotos(updatedPhotos);
      
      // Notify parent component
      if (onPhotoAdded) {
        onPhotoAdded(newPhoto);
      }

      Alert.alert(
        'Photo Added! 📸',
        `Thank you ${contributorName}! Your photo has been added to Adam & Courtney's wedding collection.`,
        [{ text: 'OK', onPress: () => setContributorName('') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add photo. Please try again.');
      console.error('Error adding photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await addPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
      console.error('Camera error:', error);
    }
  };

  const selectPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await addPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select photo');
      console.error('Gallery error:', error);
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Add Photo 📸',
      'How would you like to add a photo?',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: selectPhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          style={styles.nameInput}
          placeholder="Enter your name..."
          value={contributorName}
          onChangeText={setContributorName}
          maxLength={50}
        />
        
        <TouchableOpacity
          style={[styles.addPhotoButton, isUploading && styles.disabledButton]}
          onPress={showPhotoOptions}
          disabled={isUploading || !contributorName.trim()}
        >
          <Text style={styles.addPhotoButtonText}>
            {isUploading ? '📤 Adding Photo...' : '📸 Add Photo'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsText}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} shared by guests
        </Text>
      </View>

      <ScrollView style={styles.photosSection} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recent Photos</Text>
        
        {photos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No photos yet! Be the first to share a moment from Adam & Courtney's special day.
            </Text>
          </View>
        ) : (
          <View style={styles.photoGrid}>
            {photos.slice().reverse().slice(0, 12).map((photo) => (
              <View key={photo.id} style={styles.photoCard}>
                <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                <View style={styles.photoInfo}>
                  <Text style={styles.photoContributor}>{photo.contributorName}</Text>
                  <Text style={styles.photoTimestamp}>{photo.timestamp}</Text>
                </View>
              </View>
            ))}
            
            {photos.length > 12 && (
              <View style={styles.morePhotosCard}>
                <Text style={styles.morePhotosText}>
                  +{photos.length - 12} more photos
                </Text>
                <Text style={styles.morePhotosSubtext}>
                  All photos will be available for Adam & Courtney to download
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  addPhotoButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  addPhotoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  photosSection: {
    flex: 1,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  photoThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  photoInfo: {
    padding: 10,
  },
  photoContributor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  photoTimestamp: {
    fontSize: 12,
    color: '#666',
  },
  morePhotosCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  morePhotosText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
  },
  morePhotosSubtext: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },
}); 