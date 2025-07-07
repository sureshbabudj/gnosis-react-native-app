import React from 'react';
import { Text, View } from 'react-native';

export const AuthLogo = () => (
  <View className="mb-8">
    <Text className="text-7xl leading-tight text-center mx-auto rounded-full bg-primary-foreground p-4 ">
      🧠
    </Text>
    <View className="flex flex-row items-baseline justify-center mt-4">
      <Text className="text-4xl font-alice mb-4 text-center text-primary inline">
        Vocab
      </Text>
      <Text className="text-4xl font-ropa mb-4 text-center text-destructive inline">
        Flip{' '}
      </Text>
      <Text className="text-3xl font-semibold px-2 mb-4 text-center text-primary inline rounded-xl bg-accent">
        AI
      </Text>
    </View>
    <Text className="text-muted-foreground text-center font-ropa">
      Gateway to a secure and decentralized future
    </Text>
  </View>
);
