import { JSX } from "react";
import { Text, View } from "react-native";
import { TabScreenProps } from "types";

export function ExploreScreen({
  navigation,
}: TabScreenProps<"Explore">): JSX.Element {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-foreground">
        Welcome to Explore
      </Text>
    </View>
  );
}
