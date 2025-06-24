# 🏖️ Blue Chair Bay Setup Checklist

## ✅ What I've Already Done For You:

1. ✅ **Updated Launch Screen** - Added "Adam & Courtney's Wedding" and "Blue Chair Bay Beach" text overlays
2. ✅ **Changed "Powered by" Message** - Now says "Powered by White Wine and Craft Beer" 🍷🍺
3. ✅ **Set Beach-Blue Background** - Beautiful ocean blue background color
4. ✅ **Updated Version Numbers** - Ready for new build (v1.0.2, build #4)
5. ✅ **Created Text Overlays** - White text with shadows for readability

## 📋 What You Need To Do:

### Step 1: Replace Images in `assets/` folder

Replace these 4 files with your Blue Chair Bay photos:

```bash
assets/
├── icon.png (1024×1024px - Square crop of Blue Chair Bay photo)
├── adaptive-icon.png (1024×1024px - Same as icon.png)  
├── splash-icon.png (1242×2688px - Full Blue Chair Bay photo)
└── favicon.png (48×48px - Tiny version for web)
```

### Step 2: Photo Specifications

**App Icon (icon.png & adaptive-icon.png):**
- Crop to square focusing on you and Adam
- Size: 1024×1024 pixels
- Make sure faces are visible when small

**Launch Screen (splash-icon.png):**
- Use full portrait photo
- Size: 1242×2688 pixels (iPhone resolution)
- The app will overlay text automatically

**Favicon (favicon.png):**
- Tiny 48×48 pixel version
- Very simple crop of your faces

### Step 3: Test Your Changes

```bash
# Test the app locally
npx expo start

# Build new version  
npx eas build --platform ios --profile production

# Submit to App Store
npx eas submit --platform ios
```

## 🎨 What Your Launch Screen Will Look Like:

```
┌─────────────────────────┐
│                         │
│                         │
│   Adam & Courtney's     │  ← Large white text with shadow
│        Wedding          │
│                         │
│   Blue Chair Bay Beach  │  ← Subtitle text
│                         │
│                         │
│    [Your Photo Here]    │  ← Blue Chair Bay background photo
│                         │
│                         │
│                         │
│                         │
│                         │
│ Powered by White Wine   │  ← Bottom text
│   and Craft Beer        │
└─────────────────────────┘
```

## 🚀 Quick Commands

**After you add the photos:**

```bash
# Test it works
npx expo start

# Build and submit
npx eas build --platform ios --profile production && npx eas submit --platform ios
```

Your Blue Chair Bay wedding app is ready to go! 🏖️📱✨ 