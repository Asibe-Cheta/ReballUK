// Script to help convert .mov files to web-compatible formats
// This script provides instructions for converting videos using FFmpeg

const fs = require('fs');
const path = require('path');

const trainingDir = path.join(__dirname, '../public/videos/training');

console.log('🎥 Video Conversion Helper');
console.log('========================');
console.log('');
console.log('The .mov files in your training directory may not be compatible with all browsers.');
console.log('Here are the recommended conversion commands using FFmpeg:');
console.log('');

// Check if training directory exists
if (fs.existsSync(trainingDir)) {
  const files = fs.readdirSync(trainingDir);
  const movFiles = files.filter(file => file.toLowerCase().endsWith('.mov'));
  
  if (movFiles.length > 0) {
    console.log('📁 Found .mov files in public/videos/training/:');
    movFiles.forEach(file => {
      console.log(`   - ${file}`);
    });
    console.log('');
    console.log('🔄 Conversion Commands (run these in your terminal):');
    console.log('');
    
    movFiles.forEach(file => {
      const baseName = path.parse(file).name;
      console.log(`# Convert ${file} to MP4 (recommended for web)`);
      console.log(`ffmpeg -i "public/videos/training/${file}" -c:v libx264 -c:a aac -movflags +faststart "public/videos/training/${baseName}.mp4"`);
      console.log('');
      console.log(`# Convert ${file} to WebM (smaller file size)`);
      console.log(`ffmpeg -i "public/videos/training/${file}" -c:v libvpx-vp9 -c:a libopus "public/videos/training/${baseName}.webm"`);
      console.log('');
    });
    
    console.log('💡 Tips:');
    console.log('- MP4 with H.264 is the most widely supported format');
    console.log('- WebM is smaller but has limited browser support');
    console.log('- The -movflags +faststart flag optimizes MP4 for web streaming');
    console.log('- You can remove the original .mov files after conversion');
  } else {
    console.log('❌ No .mov files found in public/videos/training/');
  }
} else {
  console.log('❌ Training directory not found: public/videos/training/');
}

console.log('');
console.log('🔧 Alternative: Update the video sources in the component');
console.log('If you convert the files, update the videoSrc paths in:');
console.log('src/components/ui/training-sessions-section.tsx');
