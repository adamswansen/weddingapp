# 🏖️ Adam & Courtney's Wedding App - Production Setup Guide

## 🚀 Features Overview

Your wedding app now includes:

### ✅ **Admin Panel** (Password Protected)
- **Access**: Tap "Adam & Courtney" 5 times on home screen
- **Password**: `AdamCourtney2024`
- **Features**:
  - Add/delete wedding events
  - Mark current event (shows "NOW" to guests)
  - Send push notifications to all guests
  - Download all photos as ZIP file

### ✅ **Photo Management**
- Guests can take photos or select from gallery
- Photos are securely stored on device
- Only you (admins) can download ALL photos
- Photos include contributor name and timestamp

### ✅ **Push Notifications**
- Send custom messages to all guests
- Pre-built templates for common events
- Wedding-themed notifications with gold colors

### ✅ **Secure Data Storage**
- All data stored locally on devices
- Admin authentication required for sensitive features
- Photos saved in protected app directory

---

## 📱 Publishing Your App

### Option 1: Expo Go (Easiest - For Testing)
```bash
# Your app is already running!
# Guests scan QR code with Expo Go app
npx expo start
```

### Option 2: Build Standalone App (Recommended for Wedding)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo account
eas login

# Build for iOS and Android
eas build --platform all

# This creates installable apps for app stores
```

### Option 3: Web Version
```bash
# Build for web deployment
npx expo export:web

# Deploy to any web hosting service
# Guests can access via browser
```

---

## 🔧 Pre-Wedding Setup Checklist

### 1. **Update Wedding Details**
Edit `App.tsx` to customize:
- [ ] Wedding date and venue
- [ ] WiFi password
- [ ] Contact information
- [ ] Couple photo (replace placeholder)

### 2. **Schedule Management**
- [ ] Use admin panel to add all wedding events
- [ ] Set correct times for each event
- [ ] Add venue locations and descriptions

### 3. **Notification Setup**
- [ ] Test push notifications on your device
- [ ] Prepare notification messages for key moments
- [ ] Set up automated reminders (optional)

### 4. **Photo Collection Setup**
- [ ] Test photo capture and storage
- [ ] Verify admin photo download works
- [ ] Plan how to collect photos after wedding

---

## 🎯 How to Use During Your Wedding

### **For You (Admins)**:

1. **Access Admin Panel**:
   - Tap your names 5 times on home screen
   - Enter password: `AdamCourtney2024`

2. **Manage Schedule**:
   - Mark current event as ceremony progresses
   - Add last-minute schedule changes
   - Send updates to guests

3. **Send Notifications**:
   - "Ceremony starting in 15 minutes!"
   - "Cocktail hour begins on the terrace"
   - "Don't forget to share your photos!"

4. **Download Photos**:
   - Access admin panel after wedding
   - Click "Download All Photos"
   - Get ZIP file with all guest photos

### **For Guests**:

1. **Install App**:
   - Scan QR code with Expo Go (iOS/Android)
   - Or visit web link you provide

2. **Share Photos**:
   - Enter their name
   - Take photo or select from gallery
   - Photos automatically added to collection

3. **Stay Updated**:
   - Check schedule for current events
   - Receive push notifications for updates
   - Leave messages in digital guestbook

---

## 🔐 Security Features

### **Admin Protection**:
- Password-protected admin panel
- Hidden access (tap couple names 5x)
- Secure session management

### **Photo Security**:
- Photos stored in app's private directory
- Only admins can download all photos
- Each photo tagged with contributor

### **Data Privacy**:
- All data stored locally on devices
- No external servers or databases
- Complete control over your wedding data

---

## 📊 Wedding Day Workflow

### **Before Ceremony**:
1. Start app on your phone
2. Send welcome notification to guests
3. Mark "Guest Arrival" as current event

### **During Events**:
1. Update current event as day progresses
2. Send notifications for key moments
3. Encourage photo sharing via notifications

### **After Wedding**:
1. Access admin panel
2. Download all photos
3. Export guest messages
4. Share memories with everyone!

---

## 🛠️ Troubleshooting

### **Push Notifications Not Working**:
- Ensure guests granted notification permissions
- Test on physical device (not simulator)
- Check Expo project configuration

### **Photos Not Saving**:
- Verify camera/gallery permissions granted
- Test on actual device with camera
- Check device storage space

### **Admin Panel Not Accessible**:
- Tap couple names exactly 5 times
- Wait 1 second between taps
- Ensure correct password entry

---

## 🎉 Advanced Features (Optional)

### **Custom Notifications**:
```javascript
// In admin panel, you can send:
- Ceremony reminders
- Photo sharing encouragement
- Guestbook message requests
- Custom announcements
```

### **Schedule Automation**:
```javascript
// Pre-schedule notifications:
- 15 min before ceremony
- Cocktail hour start
- Dinner announcement
- First dance time
```

### **Photo Analytics**:
```javascript
// Track in admin panel:
- Total photos collected
- Contributors list
- Timeline of photo uploads
- Most active photographers
```

---

## 💡 Pro Tips for Your Wedding

1. **Designate a Tech Helper**: Have a friend help guests with app setup
2. **Print QR Codes**: Place at each table for easy access
3. **Announce the App**: Mention during welcome speech
4. **Test Everything**: Try all features before the big day
5. **Backup Plan**: Have traditional disposable cameras as backup

---

## 🎊 After Your Wedding

### **Photo Collection**:
- Download all photos immediately
- Create shared album for guests
- Send thank you message with photo link

### **Guest Messages**:
- Export all guestbook messages
- Create a wedding memory book
- Share favorite messages with family

### **App Memories**:
- Keep the app as a digital keepsake
- Show friends your custom wedding tech
- Use as inspiration for other events

---

## 🆘 Support & Contact

If you need help during your wedding:
- Check this guide first
- Test features in advance
- Have a backup plan ready
- Remember: the most important thing is celebrating your love! 💕

**Congratulations Adam & Courtney!** 🎉

Your beautiful beach-themed wedding app is ready to capture all the magical moments of your special day at Blue Chair Bay! 🏖️✨ 