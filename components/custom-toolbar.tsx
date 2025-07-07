import { Ionicons } from '@expo/vector-icons';
import theme from 'lib/theme';
import { JSX } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ThemeName } from 'types';

export function CustomTabBar({
  state,
  navigation,
  selectedTheme,
}: {
  state: any;
  navigation: any;
  selectedTheme: ThemeName;
}): JSX.Element {
  const tabs = [
    { name: 'Home', icon: 'home', label: 'Home' },
    { name: 'Glance', icon: 'eye', label: 'Glance' },
    { name: 'Progress', icon: 'bar-chart', label: 'Progress' },
    { name: 'Profile', icon: 'person-circle', label: 'Profile' },
  ];
  return (
    <View className="flex-row bg-background border-t-2 border-border px-4">
      {tabs.map((tab, index) => {
        if (!state.routes[index]) return null;
        const isFocused = state.index === index;
        const routeName = state.routes[index].name;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(routeName)}
            className="flex-1 items-center justify-center py-2 rounded-xl transition-all">
            <View className="items-center justify-center w-10 h-10">
              <Ionicons
                name={tab.icon as any}
                size={24}
                color={
                  isFocused
                    ? theme[selectedTheme].secondaryForeground
                    : theme[selectedTheme].mutedForeground
                }
              />
            </View>
            <Text
              className={`text-xs font-medium ${
                isFocused
                  ? 'text-secondary-foreground'
                  : 'text-muted-foreground'
              }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
