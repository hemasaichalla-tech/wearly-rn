import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography, Spacing, Radius, Shadow } from "../styles/theme";
import InputField from "../components/InputField";
import {
  Link2Icon,
  ArrowRightIcon,
  StarIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "../components/Icons";

const mockComparison = {
  product: "Nike Air Force 1 '07",
  platforms: [
    {
      name: "Amazon",
      price: 7495,
      rating: 4.3,
      pros: ["Fast delivery", "Easy returns"],
      cons: ["Limited sizes"],
    },
    {
      name: "Myntra",
      price: 6995,
      rating: 4.5,
      pros: ["Best price", "More sizes"],
      cons: ["Slower delivery"],
    },
    {
      name: "Ajio",
      price: 7295,
      rating: 4.1,
      pros: ["Coupons available"],
      cons: ["Fewer reviews"],
    },
    {
      name: "Flipkart",
      price: 7199,
      rating: 4.2,
      pros: ["EMI options"],
      cons: ["Authenticity concerns"],
    },
  ],
  bestPrice: "Myntra",
  overallRating: 4.3,
};

function PlatformCard({
  platform,
  isBest,
  index,
}: {
  platform: (typeof mockComparison.platforms)[0];
  isBest: boolean;
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.platformCard, { opacity, transform: [{ translateY }] }]}
    >
      <View style={styles.platformHeader}>
        <View>
          <Text style={styles.platformName}>{platform.name}</Text>
          <View style={styles.ratingRow}>
            <StarIcon size={12} color={Colors.gold} filled />
            <Text style={styles.ratingText}>{platform.rating}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.platformPrice,
            isBest && styles.platformPriceBest,
          ]}
        >
          ₹{platform.price}
        </Text>
      </View>

      <View style={styles.prosConsRow}>
        <View style={styles.prosCol}>
          {platform.pros.map((pro) => (
            <View key={pro} style={styles.prosItem}>
              <ThumbsUpIcon size={10} color={Colors.forest} strokeWidth={2} />
              <Text style={styles.prosText}>{pro}</Text>
            </View>
          ))}
        </View>
        <View style={styles.consCol}>
          {platform.cons.map((con) => (
            <View key={con} style={styles.consItem}>
              <ThumbsDownIcon size={10} color={Colors.destructive} strokeWidth={2} />
              <Text style={styles.consText}>{con}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export default function CompareScreen() {
  const [url, setUrl] = useState("");
  const [showResult, setShowResult] = useState(false);

  const resultOpacity = useRef(new Animated.Value(0)).current;
  const resultY = useRef(new Animated.Value(12)).current;

  const handleCompare = () => {
    if (url.trim()) {
      setShowResult(true);
      Animated.parallel([
        Animated.timing(resultOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(resultY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const bestPlatform = mockComparison.platforms.find(
    (p) => p.name === mockComparison.bestPrice
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Price Compare</Text>
          <Text style={styles.subtitle}>
            Paste a product link to compare across platforms
          </Text>

          {/* Search row */}
          <View style={styles.searchRow}>
            <InputField
              value={url}
              onChangeText={setUrl}
              placeholder="Paste product URL..."
              leftIcon={<Link2Icon size={16} color={Colors.mutedForeground} />}
              containerStyle={styles.urlInput}
              keyboardType="url"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={handleCompare}
              activeOpacity={0.8}
            >
              <ArrowRightIcon size={18} color={Colors.cream} />
            </TouchableOpacity>
          </View>

          {/* Results */}
          {showResult && (
            <Animated.View
              style={{ opacity: resultOpacity, transform: [{ translateY: resultY }] }}
            >
              {/* Product card */}
              <View style={styles.productCard}>
                <Text style={styles.productName}>{mockComparison.product}</Text>
                <View style={styles.ratingRow}>
                  <StarIcon size={14} color={Colors.gold} filled />
                  <Text style={styles.overallRating}>
                    {mockComparison.overallRating}/5
                  </Text>
                  <Text style={styles.overallRatingLabel}>Overall Rating</Text>
                </View>
              </View>

              {/* Best price */}
              <View style={styles.bestPriceCard}>
                <Text style={styles.bestPriceLabel}>Best Price</Text>
                <Text style={styles.bestPriceValue}>
                  {mockComparison.bestPrice} — ₹{bestPlatform?.price}
                </Text>
              </View>

              {/* Platforms */}
              {mockComparison.platforms.map((platform, i) => (
                <PlatformCard
                  key={platform.name}
                  platform={platform}
                  isBest={platform.name === mockComparison.bestPrice}
                  index={i}
                />
              ))}
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.base,
    paddingBottom: 24,
    gap: 16,
  },

  title: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.lg,
    color: Colors.foreground,
    marginBottom: 0,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
  },

  searchRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  urlInput: {
    flex: 1,
    borderRadius: Radius.xl,
  },
  searchBtn: {
    width: 46,
    height: 50,
    borderRadius: Radius.xl,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },

  // Product card
  productCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.card,
  },
  productName: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.base,
    color: Colors.foreground,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  overallRating: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.xs,
    color: Colors.foreground,
  },
  overallRatingLabel: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
  },

  // Best price
  bestPriceCard: {
    backgroundColor: `${Colors.forest}14`,
    borderWidth: 1,
    borderColor: `${Colors.forest}40`,
    borderRadius: Radius.xl,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bestPriceLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.xs,
    color: Colors.forest,
  },
  bestPriceValue: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.sm,
    color: Colors.forest,
  },

  // Platform
  platformCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.card,
  },
  platformHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  platformName: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
  },
  ratingText: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
  },
  platformPrice: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.lg,
    color: Colors.foreground,
  },
  platformPriceBest: {
    color: Colors.forest,
  },
  prosConsRow: {
    flexDirection: "row",
    gap: 12,
  },
  prosCol: { flex: 1, gap: 4 },
  consCol: { flex: 1, gap: 4 },
  prosItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  consItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  prosText: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xxs,
    color: Colors.forest,
    flex: 1,
  },
  consText: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xxs,
    color: Colors.destructive,
    flex: 1,
  },
});
