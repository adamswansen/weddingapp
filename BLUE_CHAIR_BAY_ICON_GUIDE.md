# 🏖️ Blue Chair Bay Wedding App Icon & Launch Screen Guide

## 📱 What You Need To Do

### Step 1: Prepare the Blue Chair Bay Photo

**For App Icon (icon.png):**
- Crop your Blue Chair Bay photo to a **square format** (1:1 ratio)
- Focus on you and Adam sitting on the blue bench
- Size: **1024 × 1024 pixels** minimum
- Format: PNG
- Make sure faces are clearly visible when scaled down

**For Launch Screen (splash-icon.png):**
- Use the full photo in **portrait orientation**
- Size: **1242 × 2688 pixels** (iPhone resolution)
- Format: PNG
- The app will automatically overlay text on top

### Step 2: Required Icon Sizes

Replace these files in the `assets/` folder:

1. **icon.png** - 1024×1024px (Main app icon)
2. **adaptive-icon.png** - 1024×1024px (Android adaptive icon)
3. **splash-icon.png** - 1242×2688px (Launch screen background)
4. **favicon.png** - 48×48px (Web favicon)

### Step 3: Quick Photo Editing Tips

**For the App Icon:**
- Crop to square focusing on your faces and the Blue Chair Bay sign
- Increase contrast/brightness so it looks good when small
- Make sure the blue color of the chair/sign pops

**For the Launch Screen:**
- Keep the full photo
- The text overlay will appear as:
  - **"Adam & Courtney's Wedding"** (top, large, white with shadow)
  - **"Blue Chair Bay Beach"** (subtitle, medium, white with shadow)  
  - **"Powered by White Wine and Craft Beer"** (bottom, small, white with shadow)

### Step 4: Image Tools You Can Use

**Free Options:**
- **Preview** (Mac) - For basic cropping and resizing
- **Canva** - Online editor with templates
- **GIMP** - Free professional editor
- **Photos app** - Basic editing on Mac/iPhone

**Quick Online Tools:**
- **TinyPNG** - For compressing images
- **Squoosh** - Google's image optimizer
- **Remove.bg** - If you want to remove background (optional)

### Step 5: What The Final Result Will Look Like

**App Icon:** 
- Square crop of you two at Blue Chair Bay
- Will appear on home screen as the app icon

**Launch Screen:**
- Full Blue Chair Bay photo as background
- Your wedding text overlaid on top
- "Powered by White Wine and Craft Beer" at bottom
- Perfect beach wedding vibe! 🏖️🍷🍺

## 🎯 Pro Tips

1. **Test the icon** - Make sure it looks good when very small (like 60×60px)
2. **Keep faces visible** - Don't crop too tight, but make sure you're the focus
3. **High contrast** - Beach photos can look washed out when small
4. **Save originals** - Keep backup copies of your edited images

## 📂 File Structure After You're Done

```
assets/
├── icon.png (1024×1024 - Square Blue Chair Bay photo)
├── adaptive-icon.png (1024×1024 - Same as icon.png)
├── splash-icon.png (1242×2688 - Full Blue Chair Bay photo)
└── favicon.png (48×48 - Tiny version of icon)
```

## 🚀 Next Steps

After you replace the images:
1. Test the app: `npx expo start`
2. Build new version: `npx eas build --platform ios`
3. Submit update: `npx eas submit --platform ios`

Your guests will see your beautiful Blue Chair Bay photo every time they open the app! 📱✨ 