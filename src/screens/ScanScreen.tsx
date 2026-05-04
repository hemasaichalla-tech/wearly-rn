import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography, Spacing, Radius, Shadow } from "../styles/theme";
import {
  ImagePlusIcon,
  CameraIcon,
  SparklesIcon,
  LoaderIcon,
} from "../components/Icons";

type ScanResult = {
  style: string;
  items: string[];
  recommendations: { name: string; price: number; platform: string }[];
};

const mockResult: ScanResult = {
  style: "Streetwear",
  items: ["Black Hoodie", "Blue Jeans", "White Sneakers"],
  recommendations: [
    { name: "Oversized Hoodie", price: 1299, platform: "Myntra" },
    { name: "Slim Fit Jeans", price: 999, platform: "Ajio" },
    { name: "Canvas Sneakers", price: 2499, platform: "Amazon" },
  ],
};

type Stage = "upload" | "analyzing" | "result";

function SpinnerView() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <LoaderIcon size={48} color={Colors.forest} strokeWidth={2} />
    </Animated.View>
  );
}

function FadeIn({
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
        duration: 400,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
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

export default function ScanScreen() {
  const [stage, setStage] = useState<Stage>("upload");
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleAnalyze = () => {
    setStage("analyzing");
    setTimeout(() => {
      setResult(mockResult);
      setStage("result");
    }, 2500);
  };

  const handleReset = () => {
    setStage("upload");
    setResult(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>AI Outfit Scanner</Text>
        <Text style={styles.subtitle}>Upload or capture an outfit to analyze</Text>

        {stage === "upload" && (
          <FadeIn delay={50}>
            <View style={styles.uploadBox}>
              <View style={styles.uploadIconCircle}>
                <ImagePlusIcon size={28} color={Colors.brown} />
              </View>
              <Text style={styles.uploadTitle}>Upload outfit photo</Text>
              <Text style={styles.uploadSpec}>JPG, PNG up to 10MB</Text>
              <View style={styles.uploadBtns}>
                <TouchableOpacity
                  style={styles.stylistBtn}
                  onPress={handleAnalyze}
                  activeOpacity={0.8}
                >
                  <ImagePlusIcon size={16} color={Colors.cream} />
                  <Text style={styles.stylistBtnText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.stylistBtn}
                  onPress={handleAnalyze}
                  activeOpacity={0.8}
                >
                  <CameraIcon size={16} color={Colors.cream} />
                  <Text style={styles.stylistBtnText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </FadeIn>
        )}

        {stage === "analyzing" && (
          <View style={styles.analyzingBlock}>
            <SpinnerView />
            <Text style={styles.analyzingTitle}>Analyzing outfit…</Text>
            <Text style={styles.analyzingDesc}>
              AI is detecting items and style
            </Text>
          </View>
        )}

        {stage === "result" && result && (
          <FadeIn delay={50}>
            <View style={styles.results}>
              {/* Style badge */}
              <View style={styles.badgeRow}>
                <SparklesIcon size={18} color={Colors.brown} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{result.style}</Text>
                </View>
              </View>

              {/* Detected items */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Detected Items</Text>
                <View style={styles.tagRow}>
                  {result.items.map((item) => (
                    <View key={item} style={styles.tag}>
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Recommendations */}
              <Text style={styles.cardTitle}>Recommended Products</Text>
              {result.recommendations.map((rec) => (
                <View key={rec.name} style={styles.recCard}>
                  <View>
                    <Text style={styles.recName}>{rec.name}</Text>
                    <Text style={styles.recPlatform}>{rec.platform}</Text>
                  </View>
                  <Text style={styles.recPrice}>₹{rec.price}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleReset}
                activeOpacity={0.85}
              >
                <Text style={styles.resetBtnText}>Scan Another Outfit</Text>
              </TouchableOpacity>
            </View>
          </FadeIn>
        )}
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
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
    marginTop: 4,
    marginBottom: Spacing.xl,
  },

  // Upload
  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: Colors.border,
    borderRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    alignItems: "center",
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.full,
    backgroundColor: Colors.creamDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  uploadTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
  },
  uploadSpec: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
    marginTop: 4,
    marginBottom: Spacing.base,
  },
  uploadBtns: { flexDirection: "row", gap: 12 },
  stylistBtn: {
    backgroundColor: Colors.forest,
    borderRadius: Radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stylistBtnText: {
    color: Colors.cream,
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.sm,
  },

  // Analyzing
  analyzingBlock: {
    marginTop: 80,
    alignItems: "center",
    gap: 12,
  },
  analyzingTitle: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.base,
    color: Colors.foreground,
  },
  analyzingDesc: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
  },

  // Results
  results: { gap: 16 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  badge: {
    backgroundColor: Colors.forest,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  badgeText: {
    color: Colors.cream,
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.xs,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadow.card,
  },
  cardTitle: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
    marginBottom: Spacing.md,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    backgroundColor: Colors.creamDark,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.xs,
    color: Colors.foreground,
  },

  recCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...Shadow.card,
  },
  recName: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
  },
  recPlatform: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  recPrice: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.sm,
    color: Colors.forest,
  },

  resetBtn: {
    backgroundColor: Colors.brown,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
  },
  resetBtnText: {
    color: Colors.cream,
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.size.base,
  },
});
