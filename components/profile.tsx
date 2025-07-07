import { Text, TouchableOpacity, View } from 'react-native';

import { useAuth } from './auth-provider';
import { HeaderBar } from './header-bar';

export function ProfileScreen({ navigation: _navigation }: any) {
  const { user, signOut } = useAuth();

  return (
    <View className="flex-1 bg-background">
      <HeaderBar />
      <View className="px-4 pt-4">
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
            onPress={signOut}>
            <Text className="text-destructive-foreground text-center font-semibold text-lg">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
