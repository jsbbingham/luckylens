# LuckyLens Changelog

## [1.0.0] - 2026-02-08

### Added
- Initial release of LuckyLens PWA
- 5 lottery games supported: Powerball, Mega Millions, Lucky for Life, Cash4Life, Lotto America
- Random number generation with cryptographic security
- Trend-based generation using historical frequency analysis
- Self-pick mode for manual number selection
- History page with CRUD operations and batch grouping
- Trends analysis: hot/cold numbers, frequency tables, even/odd & high/low distributions
- Settings page with dark mode, default game/set count, and no-repeat toggle
- Full PWA support with service worker and offline functionality
- Animated SVG logo with sparkle effects
- Error boundary for graceful error handling
- DB availability checking with user notifications
- Accessibility: reduced motion support throughout

### Fixed (2026-02-08)
- Added Suspense wrapper to generate page for Next.js 14 compatibility
- Fixed TypeScript Set iteration error with ES2015 target
- Added "use client" directive to generate page
- Improved reduced motion support in BallRevealAnimation
- Fixed hydration mismatch issues in ClientLayout
- Updated Header component scroll handler for SSR safety

### Technical
- Built with Next.js 14 + React 18 + TypeScript 5
- Tailwind CSS for styling
- Dexie.js for IndexedDB storage
- Lucide React for icons
- Static export for deployment
