# REBALL Assets Directory

This directory contains all static assets for the REBALL platform.

## Directory Structure

```
public/
├── images/           # Photos, screenshots, hero images
│   ├── hero/         # Hero section images
│   ├── about/        # About section photos (Harry's photo, etc.)
│   ├── training/     # Training-related images
│   └── dashboard/    # Dashboard screenshots/mockups
├── logos/            # REBALL brand logos and variations
│   ├── logo.svg      # Main REBALL logo
│   ├── logo-white.svg # White version for dark backgrounds
│   ├── logo-black.svg # Black version for light backgrounds
│   └── favicon.ico   # Favicon file
└── icons/            # UI icons, feature icons
    ├── features/     # Feature-specific icons
    └── social/       # Social media icons
```

## Usage in Next.js

### Images
```jsx
import Image from 'next/image';

// For images
<Image 
  src="/images/hero/training-session.jpg" 
  alt="Football training session"
  width={800}
  height={600}
/>

// For logos
<Image 
  src="/logos/logo.svg" 
  alt="REBALL Logo"
  width={120}
  height={40}
/>
```

### Direct SVG Usage
```jsx
// For SVG logos in navbar/footer
<img src="/logos/logo-white.svg" alt="REBALL" className="w-8 h-8" />
```

### Background Images (CSS)
```css
.hero-bg {
  background-image: url('/images/hero/football-field.jpg');
}
```

## File Naming Conventions

- Use lowercase with hyphens: `training-session.jpg`
- Be descriptive: `harry-founder-photo.jpg`
- Include size if multiple versions: `logo-small.svg`, `logo-large.svg`
- Use appropriate formats:
  - `.svg` for logos and icons (scalable)
  - `.jpg` for photos (smaller file size)
  - `.png` for graphics with transparency
  - `.webp` for modern browsers (Next.js can auto-convert)

## Recommended Sizes

### Logos
- Main logo: 200x60px (or equivalent ratio)
- Favicon: 32x32px, 16x16px
- Social sharing: 1200x630px

### Hero Images
- Desktop: 1920x1080px
- Mobile: 768x1024px

### Profile Photos
- Square format: 400x400px minimum
- For Harry's photo: 320x320px (as currently used)

## Current Assets to Replace

1. **Main Logo**: Replace placeholder SVG in navbar with actual REBALL logo
2. **Harry's Photo**: Replace data URI with actual photo in `/images/about/harry-founder.jpg`
3. **Hero Images**: Add training session photos for hero section
4. **Feature Icons**: Custom icons for SISW, TAV, 1v1 features

## Next.js Image Optimization

Next.js automatically optimizes images when using the `Image` component:
- Automatic WebP conversion
- Responsive loading
- Lazy loading
- Proper sizing

Always use the `Image` component for better performance!
