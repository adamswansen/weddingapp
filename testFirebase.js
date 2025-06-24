// Simple Firebase Test - Run this to validate Firebase setup
import { storage } from './firebaseConfig.js';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase Storage connection...');
    
    // Try to access the wedding-photos folder
    const photosRef = ref(storage, 'wedding-photos/');
    
    // This should work even if folder is empty
    const result = await listAll(photosRef);
    
    console.log('✅ Firebase Storage connected successfully!');
    console.log(`📁 Found ${result.items.length} photos in storage`);
    
    return {
      success: true,
      photoCount: result.items.length,
      message: 'Firebase Storage is working!'
    };
    
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    
    if (error.code === 'storage/unknown') {
      return {
        success: false,
        message: 'Please update firebaseConfig.js with your real Firebase credentials'
      };
    }
    
    return {
      success: false,
      message: `Firebase error: ${error.message}`
    };
  }
};

// Call this function to test
// testFirebaseConnection().then(result => console.log(result)); 