# Project Structure

```
src/
├── components/              # Reusable React components
│   ├── ActionButton.tsx      # CTA button component
│   ├── Footer.tsx            # Footer section
│   ├── Hero.tsx              # Hero image section
│   ├── MusicCard.tsx         # Individual music item card
│   ├── MusicSection.tsx      # Music discography section
│   ├── Navbar.tsx            # Navigation bar
│   └── NavLink.tsx           # Navigation link component
│
├── pages/                   # Page components
│   └── Home.tsx             # Main home page
│
├── hooks/                   # Custom React hooks
│   └── useScroll.ts         # Scroll position hook
│
├── utils/                   # Utility functions & constants
│   └── constants.ts         # App constants, nav links, music items
│
├── types/                   # TypeScript type definitions
│   └── music.ts             # Music-related interfaces
│
├── styles/                  # Global styles
│   └── globals.css          # Global CSS & animations
│
├── assets/                  # Static assets
│   └── images/              # Image files
│
├── App.tsx                  # Main app entry point
├── main.tsx                 # Vite entry point
├── vite-env.d.ts           # Vite type definitions
└── index.css               # (Legacy, use globals.css instead)
```

## File Organization Guide

- **components/** - Reusable, presentational components
- **pages/** - Page-level components that combine multiple components
- **hooks/** - Custom React hooks for shared logic
- **utils/** - Helper functions and constants
- **types/** - TypeScript types and interfaces
- **styles/** - Global and component-specific CSS
