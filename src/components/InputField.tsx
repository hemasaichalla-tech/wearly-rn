import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from "react-native";
import { Colors, Typography, Radius, Spacing } from "../styles/theme";

interface InputFieldProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  pill?: boolean;
}

export default function InputField({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  containerStyle,
  pill = false,
  ...rest
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        pill && styles.pill,
        focused && styles.focused,
        containerStyle,
      ]}
    >
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.mutedForeground}
        style={[styles.input, leftIcon ? styles.inputWithIcon : undefined]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.brownLight,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    height: 50,
  },
  pill: {
    borderRadius: Radius.full,
  },
  focused: {
    borderColor: Colors.brown,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.size.base,
    fontFamily: Typography.body,
    color: Colors.foreground,
    paddingVertical: 0,
  },
  inputWithIcon: {
    flex: 1,
  },
});
