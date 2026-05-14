export const Colors = {
  // New design system
  background: "#F5F5DC",
  primary: "#F5F5DC",
  secondary: "#654321",
  accent: "#D4A373",
  feature: "#3A5A40",
  white: "#FFFFFF",
  lightBeige: "#FAF9F2",

  textPrimary: "#2B2B2B",
  textSecondary: "#6E6E6E",
  textOnDark: "#FFFFFF",

  // Legacy aliases
  foreground: "#2B2B2B",
  mutedForeground: "#6E6E6E",
  forest: "#3A5A40",
  forestLight: "#4A6A50",
  brown: "#654321",
  brownLight: "#8B6F47",
  gold: "#C9974A",
  cream: "#F5F5DC",
  creamDark: "#EBE8E2",
  blush: "#D9B5B5",
  card: "#FFFFFF",
  navBg: "#FFFFFF",
  destructive: "#D92D20",
  border: "#E6E2D3",
  input: "#FAF9F2",
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
