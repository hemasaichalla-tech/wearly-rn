import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Colors, Typography, Spacing, Radius } from "../styles/theme";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
};

export default function SplashScreen({ navigation }: Props) {
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleY, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.titleBlock,
          { opacity: titleOpacity, transform: [{ translateY: titleY }] },
        ]}
      >
        <Text style={styles.title}>WEARLY</Text>
        <Text style={styles.tagline}>Plan  |  Pick  |  Wear</Text>
      </Animated.View>

      <Animated.View style={[styles.btnWrapper, { opacity: btnOpacity }]}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  titleBlock: {
    alignItems: "center",
  },
  title: {
    fontFamily: Typography.display,
    fontSize: Typography.size["4xl"],
    color: Colors.foreground,
    letterSpacing: 12,
  },
  tagline: {
    marginTop: 10,
    fontFamily: Typography.bodyLight,
    fontSize: Typography.size.sm,
    color: Colors.brown,
    letterSpacing: 6,
  },
  btnWrapper: {
    marginTop: 80,
    width: "100%",
  },
  btn: {
    backgroundColor: Colors.brown,
    borderRadius: Radius.full,
    paddingVertical: 14,
    paddingHorizontal: Spacing["2xl"],
    alignItems: "center",
  },
  btnText: {
    color: Colors.cream,
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.size.base,
    letterSpacing: 0.5,
  },
});
