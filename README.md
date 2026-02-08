# LuckyLens 🎯

**Your Fun Lottery Companion**

A modern, privacy-focused Progressive Web App for generating and tracking lottery numbers. Built with Next.js, TypeScript, and Tailwind CSS.

![LuckyLens](https://img.shields.io/badge/LuckyLens-v1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎮 Features

### Number Generation
- **Random Generation** — Cryptographically secure random numbers
- **Trend-Based Generation** — Uses historical frequency analysis (hot/cold numbers)
- **Self-Pick Mode** — Manually select your lucky numbers
- **Multi-Set Support** — Generate 1-5 sets at once

### Games Supported
- Powerball (USA)
- Mega Millions (USA)
- Lucky for Life (USA)
- Cash4Life (USA)
- Lotto America (USA)

### Analysis & Tracking
- **Trends Page** — Hot/cold number analysis, frequency tables
- **Distribution Stats** — Even/odd and high/low split analysis
- **History** — Save and manage your favorite number sets
- **Draw Results** — Sync and view historical winning numbers

### User Experience
- 🌙 Dark mode support (Light/Dark/System)
- 📱 PWA ready — Install on iOS/Android/home screen
- 💾 All data stored locally (IndexedDB)
- 🔒 Zero data collection — Complete privacy
- ⚡ Fast, offline-capable

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/luckylens.git
cd luckylens

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
luckylens/
├── app/                    # Next.js app directory
│   ├── generate/          # Number generation page
│   ├── history/           # Saved numbers history
│   ├── privacy/           # Privacy policy
│   ├── results/           # Historical results
│   ├── self-pick/         # Manual number selection
│   ├── settings/          # App settings
│   ├── terms/             # Terms of service
│   ├── trends/            # Analysis page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── template.tsx       # App template with providers
├── components/            # React components
│   ├── BallDisplay.tsx    # Lottery ball display
│   ├── ClientLayout.tsx   # Layout with error boundary
│   ├── ConfirmDialog.tsx  # Confirmation modal
│   ├── ErrorBoundary.tsx  # Error catching
│   ├── GameSelector.tsx   # Game dropdown
│   ├── Header.tsx         # App header
│   ├── Logo.tsx           # SVG logo
│   ├── LogoHero.tsx       # Hero logo with text
│   ├── Providers.tsx      # Context providers
│   ├── SetCountSelector.tsx # 1-5 selector
│   ├── Toggle.tsx         # Switch component
│   └── ...
├── hooks/                 # Custom React hooks
│   ├── useDBAvailable.ts  # IndexedDB check
│   ├── useDrawResults.ts  # Results sync/management
│   ├── useHistory.ts      # Saved numbers CRUD
│   ├── useServiceWorker.ts # PWA registration
│   ├── useSettings.ts     # User settings
│   ├── useTheme.tsx       # Dark mode
│   ├── useToast.tsx       # Notifications
│   └── useTrends.ts       # Trend analysis
├── lib/                   # Utility functions
│   ├── db.ts              # Dexie/IndexedDB setup
│   ├── games.ts           # Game configurations
│   ├── random.ts          # Random generation
│   ├── trends.ts          # Frequency analysis
│   ├── utils.ts           # Helper functions
│   └── weighted.ts        # Trend-based generation
├── types/                 # TypeScript types
│   └── index.ts           # All type definitions
├── public/                # Static assets
│   ├── icons/             # PWA icons
│   ├── manifest.json      # PWA manifest
│   └── sw.js              # Service worker
├── scripts/               # Build scripts
│   └── generate-icons.ts  # Icon generation
├── next.config.js         # Next.js config
├── tailwind.config.ts     # Tailwind config
└── package.json
```

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context + Hooks
- **Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PWA**: Custom service worker, web manifest

## 📱 PWA Features

LuckyLens is a fully-featured Progressive Web App:

- ✅ Installable on iOS, Android, and desktop
- ✅ Works offline (cached static assets)
- ✅ Add to home screen
- ✅ Responsive design for all screen sizes
- ✅ Native-like app experience

### Installing

**iOS (Safari)**:
1. Open luckylens.app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

**Android (Chrome)**:
1. Open luckylens.app in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home screen"

**Desktop (Chrome/Edge)**:
1. Open luckylens.app
2. Click the install icon in the address bar
3. Follow the prompts

## 🔐 Privacy

LuckyLens is built with privacy as a core principle:

- **No account required** — Use immediately without signup
- **No data collection** — We don't collect any personal information
- **Local storage only** — All data stays on your device
- **No analytics** — No tracking or monitoring
- **No ads** — Clean, distraction-free experience
- **Open source** — Transparent codebase

See our [Privacy Policy](https://luckylens.app/privacy) for details.

## ⚖️ Disclaimer

**LuckyLens is for entertainment purposes only.**

- This app does not sell lottery tickets
- Numbers are randomly generated and have no predictive value
- Past results do not guarantee future outcomes
- Please play responsibly and within your means
- This app is not affiliated with any lottery organization
- Must be 18+ to use (or legal gambling age in your jurisdiction)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and recent fixes.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Storage powered by [Dexie.js](https://dexie.org/)

## 📞 Contact

- Website: [https://luckylens.app](https://luckylens.app)
- Email: contact@luckylens.app
- Issues: [GitHub Issues](https://github.com/yourusername/luckylens/issues)

---

Made with ❤️ for lottery enthusiasts everywhere. Play responsibly!
