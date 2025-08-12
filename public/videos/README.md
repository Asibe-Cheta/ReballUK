# 🎬 REBALL Video Assets Directory

This directory contains all video content for the REBALL platform.

## Directory Structure

```
public/videos/
├── hero/              # Hero section background videos
│   ├── hero-training.mp4      # Main hero video (MP4 format)
│   ├── hero-training.webm     # Hero video (WebM format - better compression)
│   └── video-poster.jpg       # Poster image shown before video loads
├── demo/              # Product demo videos
│   ├── sisw-demo.mp4          # SISW feature demonstration
│   ├── tav-demo.mp4           # TAV feature demonstration
│   └── app-overview.mp4       # General app overview
├── training/          # Training session videos
│   ├── 1v1-examples/          # Example 1v1 scenarios
│   ├── technique-demos/       # Technique demonstrations
│   └── analysis-samples/      # Sample analysis videos
└── testimonials/      # User testimonial videos
    ├── player-stories/        # Player success stories
    └── coach-reviews/         # Coach testimonials
```

## Video Requirements

### **Hero Video** (`public/videos/hero/`)
- **Duration**: 10-30 seconds (loops seamlessly)
- **Resolution**: 1920x1080 (Full HD) minimum
- **Format**: MP4 (H.264) + WebM for best compatibility
- **Content**: Football training action, 1v1 scenarios, dynamic shots
- **Audio**: None (muted autoplay)
- **File Size**: Under 10MB for fast loading

### **Demo Videos** (`public/videos/demo/`)
- **Duration**: 30-90 seconds
- **Resolution**: 1920x1080 or 1280x720
- **Format**: MP4 (H.264)
- **Content**: Screen recordings, feature demonstrations
- **Audio**: Optional (with controls)

### **Training Videos** (`public/videos/training/`)
- **Duration**: Variable (30 seconds - 5 minutes)
- **Resolution**: 1920x1080 recommended
- **Format**: MP4 (H.264)
- **Content**: Actual training sessions, analysis examples

## Current Implementation

### **Hero Section Video**
The hero section is now configured to use:
```jsx
<video autoPlay muted loop playsInline>
  <source src="/videos/hero/hero-training.mp4" type="video/mp4" />
  <source src="/videos/hero/hero-training.webm" type="video/webm" />
</video>
```

**Features:**
- ✅ Auto-plays on page load
- ✅ Loops continuously
- ✅ Muted (required for autoplay)
- ✅ Responsive scaling
- ✅ Dark overlay for text readability
- ✅ Poster image fallback
- ✅ Multiple format support

## Upload Instructions

### **Priority Upload** 🔴
1. **Hero Video**: Upload your main training video as:
   - `public/videos/hero/hero-training.mp4`
   - Optionally: `public/videos/hero/hero-training.webm` (smaller file size)

### **Supporting Files**
2. **Poster Image**: Upload a high-quality frame as:
   - `public/images/hero/video-poster.jpg`

### **Future Videos**
3. **Demo Videos**: For "Watch Demo" button functionality
4. **Training Examples**: For showcasing SISW/TAV features

## Technical Specifications

### **Recommended Encoding Settings**
```
Video Codec: H.264
Audio Codec: AAC (if audio needed)
Frame Rate: 30fps
Bitrate: 2-5 Mbps (balance quality vs file size)
Container: MP4
```

### **WebM Alternative** (Optional but Recommended)
```
Video Codec: VP9
Container: WebM
Bitrate: 1-3 Mbps (better compression than MP4)
```

## Performance Considerations

- **Preload**: Videos are preloaded for instant playback
- **Lazy Loading**: Non-hero videos can be lazy-loaded
- **Mobile**: Videos scale appropriately on mobile devices
- **Bandwidth**: Consider providing lower quality versions for slow connections

## Accessibility

- **Poster Images**: Always provide poster images
- **Subtitles**: Consider adding subtitle tracks for accessibility
- **Controls**: Demo videos include playback controls
- **Alternative Text**: Describe video content for screen readers

## Browser Support

✅ Chrome/Edge: Full support  
✅ Firefox: Full support  
✅ Safari: Full support (with some limitations on autoplay)  
✅ Mobile: Works on modern mobile browsers  

## File Naming Conventions

- Use lowercase with hyphens: `hero-training.mp4`
- Be descriptive: `1v1-striker-finishing.mp4`
- Include quality indicator if multiple versions: `demo-hd.mp4`, `demo-mobile.mp4`
- Use appropriate extensions: `.mp4`, `.webm`, `.mov`

## Next Steps

1. **Upload your hero training video** to `/videos/hero/`
2. **Test the video** by running the development server
3. **Optimize file size** if the video is too large
4. **Add demo videos** for the "Watch Demo" buttons
5. **Consider adding testimonial videos** for social proof

The hero section is ready for your video! 🎬
