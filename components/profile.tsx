import { Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "./auth-provider";
import { JSX } from "react";
import { TabScreenProps } from "types";

export function ProfileScreen({
  navigation,
}: TabScreenProps<"Profile">): JSX.Element {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 bg-background px-6 py-8">
      <View className="bg-card rounded-2xl p-6 shadow-lg">
        <Text className="text-2xl font-bold text-foreground mb-6 text-center">
          Profile
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-sm font-medium text-muted-foreground mb-1">
              Name
            </Text>
            <Text className="text-lg font-semibold text-foreground">
              {user?.name}
            </Text>
          </View>

          <View>
            <Text className="text-sm font-medium text-muted-foreground mb-1">
              Email
            </Text>
            <Text className="text-lg font-semibold text-foreground">
              {user?.email}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="bg-destructive py-3 rounded-lg mt-8"
          onPress={signOut}
        >
          <Text className="text-destructive-foreground text-center font-semibold text-lg">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
