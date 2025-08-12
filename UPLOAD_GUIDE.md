# 📁 REBALL Asset Upload Guide

## Where to Upload Your Images and Logos

### 🎯 **Quick Reference**
All assets go in the `public/` folder and can be accessed directly via URL paths.

```
public/
├── logos/           ← REBALL logos here
├── images/          ← Photos and images here
├── videos/          ← Video content here 🎬 NEW!
└── icons/           ← UI icons here
```

---

## 📂 **Directory Structure**

### **Logos** (`public/logos/`)
```
public/logos/
├── logo-white.svg          ← Main logo (white for dark backgrounds) ✅ READY
├── logo-black.svg          ← Main logo (black for light backgrounds) ✅ READY
├── logo-main.svg           ← Your actual brand logo (UPLOAD THIS)
├── favicon.ico             ← Browser tab icon (UPLOAD THIS)
└── logo-variations/        ← Different sizes/versions
    ├── logo-small.svg
    ├── logo-large.svg
    └── logo-horizontal.svg
```

### **Videos** (`public/videos/`) 🎬 **NEW!**
```
public/videos/
├── hero/                   ← Hero section video background
│   ├── hero-training.mp4   ← Main hero video (UPLOAD THIS) 🔴 PRIORITY
│   ├── hero-training.webm  ← Optimized version (optional)
│   └── video-poster.jpg    ← Poster image (in images/hero/)
├── demo/                   ← Feature demonstration videos
│   ├── sisw-demo.mp4
│   ├── tav-demo.mp4
│   └── app-overview.mp4
├── training/               ← Training session videos
│   ├── 1v1-examples/
│   └── technique-demos/
└── testimonials/           ← User testimonial videos
    └── player-stories/
```

### **Images** (`public/images/`)
```
public/images/
├── hero/                   ← Hero section support images
│   ├── video-poster.jpg    ← Video poster image (UPLOAD THIS) 🔴 PRIORITY
│   └── fallback-bg.jpg     ← Fallback background
├── about/                  ← About section photos
│   ├── harry-founder.jpg   ← Harry's photo ✅ DONE
│   ├── team-photo.jpg
│   └── facility.jpg
├── training/               ← Training-related images
│   ├── sisw-demo.jpg
│   ├── tav-analysis.jpg
│   └── 1v1-session.jpg
└── dashboard/              ← Dashboard screenshots
    ├── mobile-app.jpg
    ├── analytics.jpg
    └── progress-chart.jpg
```

### **Icons** (`public/icons/`)
```
public/icons/
├── features/               ← Feature-specific icons
│   ├── sisw-icon.svg
│   ├── tav-icon.svg
│   └── mastery-icon.svg
└── social/                 ← Social media icons
    ├── twitter.svg
    ├── instagram.svg
    └── linkedin.svg
```

---

## 🚀 **How to Upload**

### **Method 1: Direct File Explorer** (Recommended)
1. Open Windows File Explorer
2. Navigate to: `C:\Users\ivone\OneDrive\Documents\reball\public\`
3. Choose the appropriate subfolder (logos, images, icons)
4. Drag and drop your files

### **Method 2: VS Code**
1. Open VS Code in your project
2. Navigate to the `public` folder in the sidebar
3. Right-click → "Upload" or drag files directly

### **Method 3: Command Line**
```bash
# Navigate to project
cd C:\Users\ivone\OneDrive\Documents\reball

# Copy files (example)
copy "C:\path\to\your\logo.svg" "public\logos\logo-main.svg"
copy "C:\path\to\harry-photo.jpg" "public\images\about\harry-founder.jpg"
```

---

## 🎨 **File Requirements**

### **Logos**
- **Format**: SVG (preferred) or PNG
- **Size**: Scalable SVG or 200x60px minimum
- **Background**: Transparent
- **Variants**: White and black versions

### **Videos** 🎬
- **Format**: MP4 (primary) + WebM (optional, better compression)
- **Hero Video**: 1920x1080px, 10-30 seconds, under 10MB
- **Demo Videos**: 1280x720px or 1920x1080px, 30-90 seconds
- **Audio**: Muted for hero video, optional for demos

### **Photos**
- **Format**: JPG (photos) or PNG (graphics)
- **Harry's Photo**: 320x320px minimum, square format
- **Video Poster**: 1920x1080px (matches video resolution)
- **Quality**: High resolution, web-optimized

### **Icons**
- **Format**: SVG (preferred) for crisp scaling
- **Size**: 24x24px or 32x32px base size
- **Style**: Consistent with REBALL brand

---

## 🔧 **After Uploading**

### **Automatic Usage**
These files are already configured to be used automatically:

✅ **Navbar Logo**: `public/logos/logo-white.svg` and `logo-black.svg`  
✅ **Footer Logo**: `public/logos/logo-white.svg`  
✅ **Harry's Photo**: `public/images/about/harry-founder.jpg` ✅ DONE  
🎬 **Hero Video**: `public/videos/hero/hero-training.mp4` (upload your video!)  
🖼️ **Video Poster**: `public/images/hero/video-poster.jpg` (upload poster image!)

### **URL Access**
Your uploaded files will be accessible at:
```
https://yoursite.com/logos/logo-main.svg
https://yoursite.com/images/about/harry-founder.jpg
https://yoursite.com/icons/features/sisw-icon.svg
```

---

## 🚨 **Priority Uploads**

### **High Priority** (Upload First)
1. **Hero Training Video** → `public/videos/hero/hero-training.mp4` 🎬 NEW!
2. **Video Poster Image** → `public/images/hero/video-poster.jpg` 🖼️ NEW!
3. **REBALL Main Logo** → `public/logos/logo-main.svg`
4. **Favicon** → `public/logos/favicon.ico`

### **Medium Priority**
4. Hero background images
5. Training session photos
6. Custom feature icons

### **Low Priority**
7. Additional team photos
8. Dashboard screenshots
9. Social media icons

---

## ✨ **Pro Tips**

- **Optimize images** before uploading (use tools like TinyPNG)
- **Use descriptive names**: `training-session-outdoor.jpg` not `IMG_123.jpg`
- **Keep backups** of original high-resolution files
- **Test locally**: Run `npm run dev` and check images load correctly
- **Mobile-friendly**: Ensure images look good on mobile devices

---

## 🆘 **Need Help?**

If you encounter any issues:
1. Check file permissions (make sure files aren't read-only)
2. Verify file extensions match expected formats
3. Ensure files are in correct directories
4. Test in browser: `http://localhost:3000/logos/your-file.svg`

**Ready to upload? Start with Harry's photo and the main logo!** 🎯
