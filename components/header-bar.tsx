import React from 'react';
import { Text, View } from 'react-native';

import { ThemeSwitcher } from './theme-switcher';

export function HeaderBar() {
  return (
    <View className="m-4 flex flex-row items-baseline">
      <View className="flex-grow flex-row justify-center">
        <Text className="text-4xl font-alice mb-4 text-center text-primary inline">
          Vocab
        </Text>
        <Text className="text-4xl font-ropa mb-4 text-center text-destructive inline">
          Flip{' '}
        </Text>
        <Text className="text-3xl font-semibold px-2 py-[3px] mb-4 text-center text-primary inline rounded-xl bg-accent">
          AI
        </Text>
      </View>
      <ThemeSwitcher className="justify-items-end" />
    </View>
  );
}
