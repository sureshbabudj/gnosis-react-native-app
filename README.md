# VocabFlip AI Mobile App

A modern Expo React Native app with authentication, theming, and custom fonts.

## Features

- Expo + React Native + TypeScript
- Authentication (Sign Up, Sign In, Sign Out)
- Persistent user storage with AsyncStorage
- Custom font support (Alice, Ropa Sans, Fira Sans)
- Light and dark theme support using Tailwind CSS v3 and CSS variables
- Bottom tab navigation (Home, Profile, Settings, Explore)
- Themed UI with semantic color classes (e.g., `bg-primary`, `text-foreground`)
- Font weight and custom font demonstrations

## Folder Structure

- `App.tsx` — Main app logic, navigation, authentication, theming, and font loading
- `global.css` — Tailwind and theme variable setup
- `tailwind.config.js` — Tailwind configuration with custom colors and fonts

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
2. **Start the Expo development server:**
   ```sh
   npx expo start
   ```
3. **Run on device or simulator:**
   - Use the Expo Go app or a simulator (iOS/Android/Web)

## Theming

- Uses semantic Tailwind classes (`bg-background`, `text-foreground`, etc.) for automatic light/dark theme switching.
- Customize colors and fonts in `global.css` and `tailwind.config.js`.

## Fonts

- Loads Alice, Ropa Sans, and Fira Sans fonts using `expo-google-fonts` and `expo-font`.
- Demonstrates all font weights and custom font usage in the Home screen.

## Authentication

- User data is stored in AsyncStorage for persistence.
- Simple password hashing and verification (for demo purposes only).

## Navigation

- Bottom tab navigation with custom tab bar and icons.
- Four main screens: Home, Profile, Settings, Explore.

## License

MIT
