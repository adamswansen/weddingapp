import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXLXptYFeDKiOPXtl39lIK-95ohnVnNnk",
  authDomain: "weddingapp-b01db.firebaseapp.com",
  projectId: "weddingapp-b01db",
  storageBucket: "weddingapp-b01db.firebasestorage.app",
  messagingSenderId: "494971421990",
  appId: "1:494971421990:web:898824ee0e95ba89bd2de7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app; 