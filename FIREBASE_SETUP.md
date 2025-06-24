# 🔥 Firebase Photo Sharing Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Project name: `adamcourtney-wedding`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firebase Storage

1. In your Firebase project, go to **Storage** in the left sidebar
2. Click "Get started"
3. Choose **Start in test mode** for easy setup:
   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```
4. Choose your storage location (us-central1 is fine)
5. Click "Done"

## Step 3: Get Web App Configuration

1. In Project Overview, click the **Web** icon `</>`
2. App nickname: `wedding-photo-app`
3. **Don't** enable Firebase Hosting
4. Click "Register app"
5. Copy the firebaseConfig object

## Step 4: Update firebaseConfig.js

Replace the placeholder values in `firebaseConfig.js` with your real values:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "adamcourtney-wedding.firebaseapp.com",
  projectId: "adamcourtney-wedding", 
  storageBucket: "adamcourtney-wedding.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Test Photo Upload

1. Take a photo in the app
2. Check Firebase Storage console
3. You should see photos in `wedding-photos/` folder
4. Files will be named: `timestamp-contributor-name.jpg`

## Security Rules (For Production)

For production, update Storage rules to be more secure:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /wedding-photos/{allPaths=**} {
      // Allow anyone to read wedding photos
      allow read: if true;
      // Allow anyone to upload photos (adjust as needed)
      allow write: if true;
    }
  }
}
```

## Free Tier Limits

Firebase Free (Spark) Plan includes:
- **5 GB Storage** - Plenty for hundreds of wedding photos
- **1 GB/day Downloads** - More than enough for your wedding
- **20,000 files** - Way more than you'll need

## App Store Compliance ✅

- ✅ Firebase is used by millions of apps in App Store
- ✅ No privacy concerns (public wedding photos)
- ✅ No authentication required (appropriate for wedding)
- ✅ Standard cloud storage service

## Features Working

After setup, your app will have:
- 📸 **Photo Upload** - Guests can share photos instantly
- 🌐 **Real-time Sync** - Photos appear on all devices
- ☁️ **Cloud Storage** - Photos saved permanently
- 🔄 **Refresh Button** - Manual sync if needed
- ✨ **Visual Indicators** - Shows shared vs local photos
- 🏷️ **Attribution** - Contributor names on all photos

## Support

If you need help, Firebase has excellent documentation at:
- [Firebase Storage Docs](https://firebase.google.com/docs/storage)
- [Web Setup Guide](https://firebase.google.com/docs/web/setup) 