import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { JSX } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): JSX.Element {
  const tabs = [
    { name: "Home", icon: "home", activeIcon: "home", label: "Home" },
    {
      name: "Profile",
      icon: "person-outline",
      activeIcon: "person",
      label: "Profile",
    },
    {
      name: "Settings",
      icon: "settings-outline",
      activeIcon: "settings",
      label: "Settings",
    },
    {
      name: "Explore",
      icon: "compass-outline",
      activeIcon: "compass",
      label: "Explore",
    },
  ];

  return (
    <View className="flex-row bg-background border-t-2 border-border px-4">
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const routeName = state.routes[index].name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(routeName);
          }
        };

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            className={`flex-1 items-center justify-center py-2 rounded-xl transition-all  ${
              isFocused
                ? "bg-primary/10 animate-[wiggle_1s_ease-in-out_500ms]"
                : "bg-transparent"
            }`}
          >
            <View className={`items-center justify-center w-10 h-10 `}>
              <Ionicons
                name={isFocused ? (tab.activeIcon as any) : (tab.icon as any)}
                size={24}
                color={isFocused ? "#222" : "#888"}
              />
            </View>
            <Text
              className={`text-xs font-medium ${
                isFocused ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
