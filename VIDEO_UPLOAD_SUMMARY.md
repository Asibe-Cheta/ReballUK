# 🎬 REBALL Video Upload - Quick Start Guide

## ✅ **What's Done**

✅ **Video directories created** in `public/videos/`  
✅ **Hero section updated** to use video background instead of static images  
✅ **Video optimization** with multiple format support (MP4 + WebM)  
✅ **Mobile responsive** video background  
✅ **Accessibility features** with poster images and fallbacks  
✅ **Performance optimized** with proper video attributes  

---

## 🎯 **What You Need to Upload**

### **🔴 PRIORITY 1: Hero Training Video**
**Location**: `public/videos/hero/hero-training.mp4`

**Requirements**:
- **Duration**: 10-30 seconds (should loop seamlessly)
- **Resolution**: 1920x1080 (Full HD)
- **File Size**: Under 10MB for fast loading
- **Content**: Dynamic football training footage, 1v1 scenarios
- **Audio**: None (video will be muted for autoplay)

### **🔴 PRIORITY 2: Video Poster Image**
**Location**: `public/images/hero/video-poster.jpg`

**Requirements**:
- **Resolution**: 1920x1080 (same as video)
- **Content**: High-quality frame from the video
- **Format**: JPG
- **Purpose**: Shows while video loads

---

## 🚀 **Upload Instructions**

### **Easiest Method**:
1. Open File Explorer
2. Navigate to: `C:\Users\ivone\OneDrive\Documents\reball\public\videos\hero\`
3. Drop your video file as `hero-training.mp4`
4. Navigate to: `C:\Users\ivone\OneDrive\Documents\reball\public\images\hero\`
5. Drop your poster image as `video-poster.jpg`

### **File Paths**:
```
C:\Users\ivone\OneDrive\Documents\reball\public\videos\hero\hero-training.mp4
C:\Users\ivone\OneDrive\Documents\reball\public\images\hero\video-poster.jpg
```

---

## 🎨 **Video Features Implemented**

### **Hero Section Features**:
- ✅ **Autoplay**: Video starts automatically when page loads
- ✅ **Loop**: Video repeats seamlessly 
- ✅ **Muted**: Required for autoplay, no sound
- ✅ **Responsive**: Scales perfectly on all devices
- ✅ **Overlay**: Dark overlay ensures text remains readable
- ✅ **Fallback**: Poster image shows if video fails to load
- ✅ **Multiple Formats**: Supports MP4 and WebM for best compatibility

### **Performance Features**:
- ✅ **Optimized Loading**: Video preloads for instant playback
- ✅ **Mobile Friendly**: Works on iOS and Android
- ✅ **Bandwidth Aware**: Efficient compression settings
- ✅ **SEO Friendly**: Proper HTML5 video implementation

---

## 🎬 **Future Video Directories**

### **Ready for Later**:
- **`public/videos/demo/`** - For "Watch Demo" button videos
- **`public/videos/training/`** - Training session examples
- **`public/videos/testimonials/`** - User success stories

### **Suggested Content**:
- SISW feature demonstration
- TAV analysis examples
- Player testimonials
- Coach reviews
- App walkthrough videos

---

## ⚡ **Testing Your Video**

After uploading:

1. **Start development server**:
   ```bash
   npm run dev
   ```

2. **Open browser**: `http://localhost:3000`

3. **Check video**:
   - Does it autoplay?
   - Does it loop smoothly?
   - Is text readable over video?
   - Does it work on mobile?

---

## 🔧 **Technical Details**

### **Video Element Code**:
```jsx
<video
  autoPlay
  muted
  loop
  playsInline
  poster="/images/hero/video-poster.jpg"
>
  <source src="/videos/hero/hero-training.mp4" type="video/mp4" />
  <source src="/videos/hero/hero-training.webm" type="video/webm" />
</video>
```

### **Browser Support**:
✅ Chrome/Edge: Full support  
✅ Firefox: Full support  
✅ Safari: Full support  
✅ Mobile: iOS/Android support  

---

## 🎯 **Ready to Go!**

Your REBALL platform is now configured for a stunning video hero section! Simply upload your training video and poster image to see it in action.

**Need help?** Check the detailed `public/videos/README.md` for technical specifications and best practices.

**Upload your video now and watch your homepage come to life!** 🚀
