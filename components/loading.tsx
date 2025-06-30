import { JSX } from "react";
import { Text, View } from "react-native";
import { AuthLogo } from "./auth-logo";

export function LoadingScreen(): JSX.Element {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <AuthLogo />
      <Text className="text-lg text-muted-foreground">Loading...</Text>
    </View>
  );
}
