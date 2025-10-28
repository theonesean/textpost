import React from 'react';
import { renderToString } from 'react-dom/server';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Create a simple SVG-based OG image instead of using React
const ogImageSvg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a192f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a3a2a;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="glow1" cx="80%" cy="20%">
      <stop offset="0%" style="stop-color:rgba(100,255,218,0.2);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(100,255,218,0);stop-opacity:1" />
    </radialGradient>
    <radialGradient id="glow2" cx="20%" cy="80%">
      <stop offset="0%" style="stop-color:rgba(0,217,255,0.2);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgba(0,217,255,0);stop-opacity:1" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#grad1)"/>
  
  <!-- Glow effects -->
  <circle cx="1000" cy="100" r="400" fill="url(#glow1)"/>
  <circle cx="200" cy="530" r="400" fill="url(#glow2)"/>
  
  <!-- Emoji -->
  <text x="600" y="180" font-size="120" text-anchor="middle" font-family="Arial, sans-serif">✏️</text>
  
  <!-- Title -->
  <text x="600" y="320" font-size="96" font-weight="700" text-anchor="middle" font-family="'Space Grotesk', Arial, sans-serif" fill="#64ffda">textpost</text>
  
  <!-- Subtitle -->
  <text x="600" y="420" font-size="48" text-anchor="middle" font-family="'Space Grotesk', Arial, sans-serif" fill="#a8b2d1">Create beautiful Instagram posts</text>
</svg>
`;

async function generateOGImage() {
  try {
    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Convert SVG to PNG
    const buffer = Buffer.from(ogImageSvg);
    await sharp(buffer)
      .png()
      .toFile(path.join(publicDir, 'og-image.png'));

    console.log('✅ OG image generated successfully at public/og-image.png');
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();
