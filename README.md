# Wearly — React Native App

A complete React Native rebuild of the Wearly fashion app using Expo.

## Tech Stack

- **Framework**: React Native + Expo SDK 51
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **Fonts**: Playfair Display (display headings) + Montserrat (UI text)
- **Icons**: Custom SVG components via react-native-svg
- **Styling**: StyleSheet only (zero CSS)

## Project Structure

```
wearly-rn/
├── App.tsx                        # Entry point, font loading, navigation container
├── src/
│   ├── navigation/
│   │   ├── types.ts               # TypeScript param types for navigators
│   │   ├── RootNavigator.tsx      # Stack: Splash → Login → Main tabs
│   │   └── TabNavigator.tsx       # Bottom tab bar with custom FAB
│   ├── screens/
│   │   ├── SplashScreen.tsx       # Animated splash / landing page
│   │   ├── LoginScreen.tsx        # Email + password login, social buttons
│   │   ├── HomeScreen.tsx         # Dashboard: stylist grid, trending
│   │   ├── WardrobeScreen.tsx     # Closet grid with search + filter
│   │   ├── ScanScreen.tsx         # AI outfit scanner (3-stage flow)
│   │   ├── CompareScreen.tsx      # Price comparison across platforms
│   │   └── ExploreScreen.tsx      # Categories + trending outfits
│   ├── components/
│   │   ├── Button.tsx             # Reusable button (primary/stylist/outline/ghost)
│   │   ├── InputField.tsx         # TextInput wrapper with focus state
│   │   ├── Card.tsx               # Card container with soft shadow
│   │   ├── StylistButton.tsx      # Forest green icon+label button
│   │   └── Icons.tsx              # All Lucide-equivalent SVG icons
│   └── styles/
│       └── theme.ts               # Colors, typography, spacing, radius, shadows
```

## Required npm Packages

```
@expo-google-fonts/playfair-display
@expo-google-fonts/montserrat
@react-navigation/bottom-tabs
@react-navigation/native
@react-navigation/native-stack
expo
expo-font
expo-linear-gradient
expo-splash-screen
expo-status-bar
react
react-native
react-native-safe-area-context
react-native-screens
react-native-svg
```

## Setup & Run

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli` (or use `npx expo`)

### Install & Start

```bash
cd wearly-rn
npm install
npx expo start
```

Then press:
- `a` — open on Android emulator
- `i` — open on iOS simulator
- Scan QR code with **Expo Go** app on your phone

### Build for Production

```bash
# Android APK
npx expo build:android

# iOS IPA
npx expo build:ios
```

## Design System

| Token | Value |
|-------|-------|
| Background | `#F5F3F0` |
| Forest (primary) | `#2D6A4F` |
| Brown (accent/CTA) | `#8B6F47` |
| Cream Dark (section bg) | `#EBE8E2` |
| Foreground text | `#3D2C25` |
| Muted text | `#6B5D56` |
| Display font | Playfair Display |
| Body font | Montserrat |

## Screens Overview

| Screen | Route | Description |
|--------|-------|-------------|
| Splash | Initial | Animated logo + "Get Started" button |
| Login | Stack | Email/password + social login (Google, Apple, Facebook) |
| Home | Tab 1 | User greeting, stylist quick-actions, featured + trending |
| Wardrobe | Tab 2 | Searchable, filterable 2-column grid of clothing items |
| Scan | Tab 3 (FAB) | Upload photo → AI analyzing spinner → style + product results |
| Compare | Tab 4 | URL input → price comparison table across platforms |
| Explore | Tab 5 | Category chips + trending outfit 2-column grid |

## Notes

- All inputs use `TextInput` with controlled `value` + `onChangeText`
- No HTML tags, CSS files, or web dependencies anywhere
- Animations use React Native's built-in `Animated` API
- Icons are pure SVG (react-native-svg), matching the Lucide icon set
- Bottom tab bar is fully custom with the brown FAB elevated above the bar
