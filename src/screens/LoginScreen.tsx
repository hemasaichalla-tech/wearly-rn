import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Colors, Typography, Spacing, Radius } from "../styles/theme";
import InputField from "../components/InputField";
import { XIcon, GoogleIcon, AppleIcon, FacebookIcon } from "../components/Icons";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <XIcon size={24} color={Colors.foreground} />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.content,
              {
                opacity: contentOpacity,
                transform: [{ translateY: contentY }],
              },
            ]}
          >
            {/* Logo */}
            <View style={styles.logoBlock}>
              <Text style={styles.logoText}>WEARLY</Text>
              <Text style={styles.tagline}>Plan  |  Pick  |  Wear</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <InputField
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your Email"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
                pill
              />
              <InputField
                value={password}
                onChangeText={setPassword}
                placeholder="Enter Password"
                secureTextEntry
                textContentType="password"
                autoComplete="password"
                pill
                containerStyle={{ marginTop: Spacing.md }}
              />

              <TouchableOpacity
                style={styles.loginBtn}
                activeOpacity={0.85}
                onPress={() => navigation.navigate("Main")}
              >
                <Text style={styles.loginBtnText}>Log in</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR Continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.75}>
                <GoogleIcon size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.75}>
                <AppleIcon size={20} color={Colors.foreground} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialCircle} activeOpacity={0.75}>
                <FacebookIcon size={20} />
              </TouchableOpacity>
            </View>

            {/* Sign up */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Create An Account </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing.base,
    paddingBottom: Spacing["2xl"],
  },
  closeBtn: {
    alignSelf: "flex-end",
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  logoBlock: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  logoText: {
    fontFamily: Typography.display,
    fontSize: Typography.size["3xl"],
    color: Colors.foreground,
    letterSpacing: 10,
  },
  tagline: {
    marginTop: 6,
    fontFamily: Typography.bodyLight,
    fontSize: Typography.size.xxs,
    color: Colors.brown,
    letterSpacing: 5,
  },
  form: {
    width: "100%",
  },
  loginBtn: {
    backgroundColor: Colors.brown,
    borderRadius: Radius.full,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  loginBtnText: {
    color: Colors.cream,
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.size.base,
    letterSpacing: 0.4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: Spacing.xl,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xs,
    color: Colors.mutedForeground,
  },
  socialRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: Spacing.lg,
  },
  socialCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.brownLight,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing["2xl"],
  },
  signupText: {
    fontFamily: Typography.body,
    fontSize: Typography.size.sm,
    color: Colors.mutedForeground,
  },
  signupLink: {
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.size.sm,
    color: Colors.foreground,
    textDecorationLine: "underline",
  },
});
