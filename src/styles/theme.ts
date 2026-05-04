// Wearly design tokens — all colors converted from the Lovable OKLCH palette

export const Colors = {
  // Backgrounds
  background: "#F5F3F0",       // oklch(0.96 0.015 85) — main app bg
  card: "#FAFAF9",             // oklch(0.98 0.01 85)
  creamDark: "#EBE8E2",        // oklch(0.92 0.02 82) — section bg, tag bg
  blush: "#D9B5B5",            // oklch(0.85 0.05 15) — warm accent bg

  // Text
  foreground: "#3D2C25",       // oklch(0.25 0.03 50) — primary text
  mutedForeground: "#6B5D56",  // oklch(0.55 0.03 50) — secondary text

  // Brand
  forest: "#2D6A4F",           // oklch(0.35 0.06 160) — primary green
  forestLight: "#3D7A5F",      // oklch(0.45 0.06 160)
  brown: "#8B6F47",            // oklch(0.55 0.1 55) — accent brown
  brownLight: "#A68B66",       // oklch(0.65 0.08 55)
  gold: "#C9974A",             // oklch(0.7 0.12 80)

  // Semantic
  destructive: "#D92D20",
  border: "#E0DDD8",           // oklch(0.88 0.02 80)
  input: "#E8E5E0",            // oklch(0.90 0.015 80)

  // Nav
  navBg: "#FAFAF9",

  // Whites / foreground on dark
  cream: "#F5F3F0",
  white: "#FFFFFF",
};

export const Typography = {
  // Font families (must be loaded via expo-font)
  display: "PlayfairDisplay_700Bold",
  displayRegular: "PlayfairDisplay_400Regular",
  body: "Montserrat_400Regular",
  bodyMedium: "Montserrat_500Medium",
  bodySemiBold: "Montserrat_600SemiBold",
  bodyBold: "Montserrat_700Bold",
  bodyLight: "Montserrat_300Light",

  // Sizes
  size: {
    xxs: 10,
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    "2xl": 28,
    "3xl": 32,
    "4xl": 38,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  fab: {
    shadowColor: "#8B6F47",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  nav: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 10,
  },
};
