import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography, Spacing, Radius, Shadow } from "../styles/theme";
import InputField from "../components/InputField";
import { SearchIcon, TrendingUpIcon, TagIcon } from "../components/Icons";

const trendingCategories = [
  { name: "Men", count: 1240 },
  { name: "Women", count: 2350 },
  { name: "Streetwear", count: 890 },
  { name: "Casual", count: 1560 },
  { name: "Formal", count: 720 },
  { name: "Activewear", count: 430 },
];

const trendingOutfits = [
  { id: "1", name: "Oversized Blazer Look", likes: 2.4, style: "Formal" },
  { id: "2", name: "Y2K Retro Fit", likes: 3.1, style: "Streetwear" },
  { id: "3", name: "Minimal Summer", likes: 1.8, style: "Casual" },
  { id: "4", name: "Athleisure Combo", likes: 2.0, style: "Activewear" },
  { id: "5", name: "Korean Style", likes: 4.2, style: "Trendy" },
  { id: "6", name: "Vintage Denim", likes: 1.5, style: "Casual" },
];

function OutfitCard({
  outfit,
  index,
}: {
  outfit: (typeof trendingOutfits)[0];
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.outfitCard, { opacity, transform: [{ translateY }] }]}
    >
      <TouchableOpacity activeOpacity={0.8}>
        <View style={styles.outfitImage}>
          <Text style={styles.outfitEmoji}>👗</Text>
        </View>
        <Text style={styles.outfitName} numberOfLines={2}>
          {outfit.name}
        </Text>
        <View style={styles.outfitMeta}>
          <Text style={styles.outfitStyle}>{outfit.style}</Text>
          <Text style={styles.outfitLikes}>❤ {outfit.likes}k</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ExploreScreen() {
  const [search, setSearch] = useState("");

  // Build grid pairs for the 2-column layout
  const outfitPairs: (typeof trendingOutfits)[] = [];
  for (let i = 0; i < trendingOutfits.length; i += 2) {
    outfitPairs.push(trendingOutfits.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Explore</Text>

        {/* Search */}
        <InputField
          value={search}
          onChangeText={setSearch}
          placeholder="Search styles, outfits..."
          leftIcon={<SearchIcon size={16} color={Colors.mutedForeground} />}
          containerStyle={styles.searchInput}
        />

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.catGrid}>
            {trendingCategories.map((cat) => (
              <TouchableOpacity
                key={cat.name}
                style={styles.catCard}
                activeOpacity={0.75}
              >
                <TagIcon size={14} color={Colors.brown} />
                <Text style={styles.catName}>{cat.name}</Text>
                <Text style={styles.catCount}>{cat.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending outfits */}
        <View style={styles.section}>
          <View style={styles.trendingHeader}>
            <TrendingUpIcon size={18} color={Colors.forest} />
            <Text style={styles.sectionTitle}>Trending Outfits</Text>
          </View>

          {outfitPairs.map((pair, rowIdx) => (
            <View key={rowIdx} style={styles.outfitRow}>
              {pair.map((outfit, colIdx) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  index={rowIdx * 2 + colIdx}
                />
              ))}
              {/* Fill gap if odd number */}
              {pair.length === 1 && <View style={styles.outfitCard} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: 24,
  },

  title: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.lg,
    color: Colors.foreground,
    marginBottom: Spacing.md,
  },
  searchInput: {
    marginBottom: Spacing.xl,
    borderRadius: Radius.xl,
  },

  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontFamily: Typography.bodyBold,
    fontSize: 17,
    color: Colors.foreground,
    marginBottom: Spacing.md,
  },

  // Categories
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  catCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 8,
    ...Shadow.card,
  },
  catName: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
  },
  catCount: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xxs,
    color: Colors.mutedForeground,
  },

  // Trending
  trendingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: Spacing.md,
  },
  outfitRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  outfitCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 12,
    ...Shadow.card,
  },
  outfitImage: {
    height: 110,
    borderRadius: Radius.lg,
    backgroundColor: Colors.creamDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  outfitEmoji: { fontSize: 32 },
  outfitName: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
    lineHeight: 18,
  },
  outfitMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  outfitStyle: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.xxs,
    color: Colors.brown,
  },
  outfitLikes: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xxs,
    color: Colors.mutedForeground,
  },
});
