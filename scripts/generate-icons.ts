/**
 * Generate PWA Icons
 * 
 * This file creates SVG-based icons that can be converted to PNG.
 * For production, use proper icon generation tools like:
 * - pwa-asset-generator
 * - @vite-pwa/assets-generator
 * - Figma/Sketch export
 */

export const generateIconSVG = (size: number): string => {
  const padding = size * 0.1;
  const innerSize = size - padding * 2;
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="lens" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0066FF" />
        <stop offset="100%" stopColor="#00CC88" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
    </defs>
    
    <!-- Background -->
    <rect width="100" height="100" rx="20" fill="url(#bg)"/>
    
    <!-- Handle -->
    <rect x="58" y="58" width="32" height="10" rx="5" fill="url(#lens)" transform="rotate(45 74 63)" filter="url(#shadow)"/>
    
    <!-- Lens ring -->
    <circle cx="40" cy="40" r="28" fill="none" stroke="url(#lens)" strokeWidth="6" filter="url(#shadow)"/>
    
    <!-- Ball 7 (blue) -->
    <circle cx="32" cy="36" r="8" fill="#4ECDC4" filter="url(#shadow)"/>
    <text x="32" y="40" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" fontFamily="system-ui">7</text>
    
    <!-- Ball 21 (red) -->
    <circle cx="48" cy="30" r="9" fill="#FF6B6B" filter="url(#shadow)"/>
    <text x="48" y="34" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white" fontFamily="system-ui">21</text>
    
    <!-- Sparkle -->
    <path d="M68 14 L70 20 L76 22 L70 24 L68 30 L66 24 L60 22 L66 20 Z" fill="#FFD700"/>
  </svg>`;
};

// Icon sizes needed for PWA
export const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

/**
 * To generate actual PNG files, you can:
 * 1. Use an online SVG to PNG converter
 * 2. Use Node.js with sharp or canvas
 * 3. Use a build tool plugin
 * 
 * Example with sharp (requires sharp package):
 * 
 * import sharp from 'sharp';
 * 
 * for (const size of ICON_SIZES) {
 *   const svg = generateIconSVG(size);
 *   await sharp(Buffer.from(svg))
 *     .resize(size, size)
 *     .png()
 *     .toFile(`public/icons/icon-${size}x${size}.png`);
 * }
 */
