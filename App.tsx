import React, { useCallback } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_500Medium,
} from "@expo-google-fonts/playfair-display";
import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import * as SplashScreen from "expo-splash-screen";
import RootNavigator from "./src/navigation/RootNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { Colors } from "./src/styles/theme";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_500Medium,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
