import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Typography, Spacing, Radius, Shadow } from "../styles/theme";
import InputField from "../components/InputField";
import { SearchIcon, ShirtIcon, PlusIcon } from "../components/Icons";

const categories = ["All", "Casual", "Formal", "Gym", "Party", "Winter"];

const mockItems = [
  { id: "1", name: "Black Hoodie", category: "Casual", color: "#E0DDD8", worn: 12 },
  { id: "2", name: "White Tee", category: "Casual", color: "#EBE8E2", worn: 24 },
  { id: "3", name: "Blue Jeans", category: "Casual", color: "#D5E0F0", worn: 18 },
  { id: "4", name: "Blazer", category: "Formal", color: "#D9CFC5", worn: 5 },
  { id: "5", name: "Red Dress", category: "Party", color: "#D9B5B5", worn: 3 },
  { id: "6", name: "Sneakers", category: "Gym", color: "#EBE8E2", worn: 30 },
  { id: "7", name: "Joggers", category: "Gym", color: "#D5E0F0", worn: 15 },
  { id: "8", name: "Wool Coat", category: "Winter", color: "#D9CFC5", worn: 6 },
];

type ClothingItem = (typeof mockItems)[0];

function AnimatedItem({
  item,
  index,
}: {
  item: ClothingItem;
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
      style={[
        styles.gridItem,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <TouchableOpacity activeOpacity={0.8} style={styles.gridCard}>
        <View
          style={[styles.itemImagePlaceholder, { backgroundColor: item.color }]}
        >
          <ShirtIcon size={28} color={Colors.mutedForeground} strokeWidth={1.5} />
        </View>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemMeta}>Worn {item.worn} times</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function WardrobeScreen() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = mockItems.filter(
    (item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item, index }: { item: ClothingItem; index: number }) => (
    <AnimatedItem item={item} index={index} />
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Closet</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
            <PlusIcon size={18} color={Colors.cream} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <InputField
          value={search}
          onChangeText={setSearch}
          placeholder="Search clothes..."
          leftIcon={<SearchIcon size={16} color={Colors.mutedForeground} />}
          containerStyle={styles.searchInput}
        />

        {/* Categories */}
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveCategory(item)}
              activeOpacity={0.75}
              style={[
                styles.catPill,
                activeCategory === item && styles.catPillActive,
              ]}
            >
              <Text
                style={[
                  styles.catLabel,
                  activeCategory === item && styles.catLabelActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Grid */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <ShirtIcon size={40} color={Colors.mutedForeground} strokeWidth={1.2} />
            <Text style={styles.emptyText}>No items found</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={styles.gridRow}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.base },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.bodyBold,
    fontSize: Typography.size.lg,
    color: Colors.foreground,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },

  searchInput: {
    marginBottom: Spacing.md,
    borderRadius: Radius.xl,
  },

  catRow: {
    gap: 8,
    paddingBottom: Spacing.md,
    paddingRight: Spacing.sm,
  },
  catPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.creamDark,
  },
  catPillActive: {
    backgroundColor: Colors.forest,
  },
  catLabel: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.xs,
    color: Colors.foreground,
  },
  catLabelActive: {
    color: Colors.cream,
  },

  grid: { paddingTop: 4, paddingBottom: 16 },
  gridRow: { gap: 12, marginBottom: 12 },
  gridItem: { flex: 1 },
  gridCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: 12,
    ...Shadow.card,
  },
  itemImagePlaceholder: {
    height: 110,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  itemName: {
    fontFamily: Typography.bodyMedium,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
  },
  itemMeta: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xxs,
    color: Colors.mutedForeground,
    marginTop: 2,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  emptyText: {
    fontFamily: Typography.body,
    fontSize: Typography.size.sm,
    color: Colors.mutedForeground,
  },
});
