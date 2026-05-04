import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Colors, Typography, Radius, Spacing } from "../styles/theme";

interface StylistButtonProps {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}

export default function StylistButton({ label, icon, onPress }: StylistButtonProps) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.forest,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 88,
    gap: 6,
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    color: Colors.cream,
    fontSize: Typography.size.xxs,
    fontFamily: Typography.bodyMedium,
    textAlign: "center",
    lineHeight: 14,
  },
});
