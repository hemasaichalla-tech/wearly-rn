import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { Colors, Typography, Radius, Spacing } from "../styles/theme";

type Variant = "primary" | "stylist" | "outline" | "ghost";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      disabled={disabled || loading}
      style={[
        styles.base,
        variant === "primary" && styles.primary,
        variant === "stylist" && styles.stylist,
        variant === "outline" && styles.outline,
        variant === "ghost" && styles.ghost,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? Colors.brown : Colors.cream}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "primary" && styles.primaryText,
            variant === "stylist" && styles.stylistText,
            variant === "outline" && styles.outlineText,
            variant === "ghost" && styles.ghostText,
            textStyle,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primary: {
    backgroundColor: Colors.brown,
  },
  stylist: {
    backgroundColor: Colors.forest,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    minWidth: 88,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.brownLight,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: Typography.size.base,
    fontFamily: Typography.bodySemiBold,
    letterSpacing: 0.3,
  },
  primaryText: {
    color: Colors.cream,
    fontFamily: Typography.bodySemiBold,
  },
  stylistText: {
    color: Colors.cream,
    fontSize: Typography.size.xs,
    fontFamily: Typography.bodyMedium,
    textAlign: "center",
  },
  outlineText: {
    color: Colors.foreground,
  },
  ghostText: {
    color: Colors.brown,
    fontSize: Typography.size.xs,
    fontFamily: Typography.bodyMedium,
  },
});
