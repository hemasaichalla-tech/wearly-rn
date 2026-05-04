import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography, Spacing, Radius, Shadow } from "../styles/theme";
import StylistButton from "../components/StylistButton";
import {
  BellIcon,
  SparklesIcon,
  ShoppingBagIcon,
  ScanLineIcon,
  CalendarIcon,
  PlusCircleIcon,
  HeartIcon,
} from "../components/Icons";

const stylistItems = [
  { label: "Outfit\nSuggestion", icon: SparklesIcon },
  { label: "Shopping", icon: ShoppingBagIcon },
  { label: "Find my Fit", icon: ScanLineIcon },
  { label: "Calendar", icon: CalendarIcon },
  { label: "Create\nOutfit", icon: PlusCircleIcon },
];

const trendingOutfits = [
  { name: "Summer Casual", tag: "Trending", color: "#D9B5B5" },
  { name: "Office Chic", tag: "Popular", color: "#EBE8E2" },
  { name: "Street Style", tag: "New", color: "#EBE8E2" },
];

function FadeInView({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeInView delay={0}>
          <View style={styles.header}>
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>W</Text>
              </View>
              <View>
                <Text style={styles.greeting}>Hello, User</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
              <BellIcon size={22} color={Colors.foreground} />
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* Stylist section */}
        <FadeInView delay={100}>
          <View style={styles.stylistSection}>
            <Text style={styles.sectionHeading}>Stylist</Text>
            <View style={styles.stylistGrid}>
              {stylistItems.map((item) => (
                <StylistButton
                  key={item.label}
                  label={item.label}
                  icon={<item.icon size={18} color={Colors.cream} strokeWidth={1.8} />}
                />
              ))}
            </View>
          </View>
        </FadeInView>

        {/* Featured Outfits */}
        <FadeInView delay={200}>
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Featured Outfits</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuredCard}>
              <View style={styles.featuredImagePlaceholder}>
                <Text style={styles.featuredEmoji}>👗</Text>
              </View>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle}>Add Outfits</Text>
                <Text style={styles.featuredDesc}>
                  Upload your wardrobe to get personalized suggestions
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Trending Now */}
        <FadeInView delay={300}>
          <View style={[styles.section, styles.lastSection]}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingRow}
            >
              {trendingOutfits.map((outfit) => (
                <View key={outfit.name} style={styles.trendingCard}>
                  <View
                    style={[
                      styles.trendingImagePlaceholder,
                      { backgroundColor: outfit.color },
                    ]}
                  >
                    <HeartIcon size={24} color={Colors.brown} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.trendingName}>{outfit.name}</Text>
                  <Text style={styles.trendingTag}>{outfit.tag}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.base, paddingBottom: 20 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xl,
  },
  userRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.blush,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.sm,
    color: Colors.brown,
  },
  greeting: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.lg,
    color: Colors.foreground,
  },
  bellBtn: { padding: Spacing.sm },

  // Stylist
  stylistSection: {
    backgroundColor: Colors.creamDark,
    borderRadius: Radius["2xl"],
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.base,
    color: Colors.foreground,
    marginBottom: Spacing.md,
  },
  stylistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Sections
  section: { marginBottom: Spacing.xl },
  lastSection: { marginBottom: 0 },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Typography.bodyBold,
    fontSize: 17,
    color: Colors.foreground,
  },
  seeAll: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.xs,
    color: Colors.brown,
  },

  // Featured
  featuredCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius["2xl"],
    overflow: "hidden",
    ...Shadow.card,
  },
  featuredImagePlaceholder: {
    height: 190,
    backgroundColor: Colors.creamDark,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredEmoji: { fontSize: 64 },
  featuredInfo: { padding: Spacing.base, alignItems: "center" },
  featuredTitle: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.base,
    color: Colors.foreground,
  },
  featuredDesc: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },

  // Trending
  trendingRow: { paddingRight: Spacing.sm, gap: 12 },
  trendingCard: {
    width: 140,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 12,
    ...Shadow.card,
  },
  trendingImagePlaceholder: {
    height: 110,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  trendingName: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
  },
  trendingTag: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.xxs,
    color: Colors.brown,
    marginTop: 2,
  },
});
