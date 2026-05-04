import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MainTabParamList } from "./types";
import { Colors, Typography, Radius, Shadow } from "../styles/theme";

import HomeScreen from "../screens/HomeScreen";
import WardrobeScreen from "../screens/WardrobeScreen";
import ScanScreen from "../screens/ScanScreen";
import CompareScreen from "../screens/CompareScreen";
import ExploreScreen from "../screens/ExploreScreen";

import {
  HomeIcon,
  GridIcon,
  PlusIcon,
  CompareIcon,
  CompassIcon,
} from "../components/Icons";

const Tab = createBottomTabNavigator<MainTabParamList>();

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBar,
        { paddingBottom: insets.bottom + 6 },
      ]}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isFab = route.name === "Scan";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isFab) {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.85}
              style={styles.fabWrapper}
            >
              <View style={styles.fab}>
                <PlusIcon size={24} color={Colors.cream} strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          );
        }

        const icons: Record<string, typeof HomeIcon> = {
          Home: HomeIcon,
          Wardrobe: GridIcon,
          Compare: CompareIcon,
          Explore: CompassIcon,
        };
        const labels: Record<string, string> = {
          Home: "Home",
          Wardrobe: "Closet",
          Compare: "Compare",
          Explore: "Explore",
        };

        const IconComponent = icons[route.name];
        const label = labels[route.name];

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            <IconComponent
              size={22}
              color={isFocused ? Colors.forest : Colors.mutedForeground}
              strokeWidth={isFocused ? 2.2 : 1.8}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? Colors.forest : Colors.mutedForeground },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wardrobe" component={WardrobeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="Compare" component={CompareScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.navBg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    ...Shadow.nav,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 2,
    gap: 3,
  },
  tabLabel: {
    fontFamily: Typography.body,
    fontSize: Typography.size.xxs,
    lineHeight: 13,
  },
  fabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.brown,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.fab,
  },
});
