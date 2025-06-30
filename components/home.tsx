import { ScrollView, Text, View } from "react-native";
import { useAuth } from "./auth-provider";
import { JSX } from "react";
import { TabScreenProps } from "types";

export function HomeScreen({
  navigation,
}: TabScreenProps<"Home">): JSX.Element {
  const { user } = useAuth();

  return (
    <ScrollView className="flex-1 bg-blue-50 px-6 py-8">
      <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Welcome to Home
      </Text>
      <Text className="text-lg font-medium text-gray-600 text-center mb-8">
        Hello, {user?.name}!
      </Text>

      {/* Font weight demonstration */}
      <View className="bg-white rounded-2xl p-6 shadow-lg">
        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
          Font Weight Examples
        </Text>

        <Text className="text-base font-thin text-gray-600 mb-2">
          ✅ Thin (100) - The quick brown fox
        </Text>
        <Text className="text-base font-extralight text-gray-600 mb-2">
          ✅ Extra Light (200) - The quick brown fox
        </Text>
        <Text className="text-base font-light text-gray-600 mb-2">
          ✅ Light (300) - The quick brown fox
        </Text>
        <Text className="text-base font-normal text-gray-700 mb-2">
          ✅ Normal (400) - The quick brown fox
        </Text>
        <Text className="text-base font-medium text-gray-700 mb-2">
          ✅ Medium (500) - The quick brown fox
        </Text>
        <Text className="text-base font-semibold text-gray-800 mb-2">
          ✅ SemiBold (600) - The quick brown fox
        </Text>
        <Text className="text-base my-font-bold text-gray-800 mb-2">
          ✅ Bold (700) - The quick brown fox
        </Text>
        <Text className="text-base font-extrabold text-gray-900 mb-2">
          ✅ Extra Bold (800) - The quick brown fox
        </Text>
        <Text className="text-base font-black text-gray-900">
          ✅ Black (900) - The quick brown fox
        </Text>
      </View>

      {/* Custom font examples */}
      <View className="bg-white rounded-2xl p-6 shadow-lg mt-6">
        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
          Custom Fonts
        </Text>
        <Text className="text-base font-alice text-gray-700 mb-2">
          ✅ Alice Font
        </Text>
        <Text className="text-base font-ropa text-gray-700 mb-2">
          ✅ Ropa Sans Regular
        </Text>
        <Text className="text-base font-ropa-italic text-gray-700">
          ✅ Ropa Sans Italic
        </Text>
      </View>

      {/* Test italic combinations */}
      <View className="bg-white rounded-2xl p-6 shadow-lg mt-6">
        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
          Italic Combinations
        </Text>
        <Text className="text-base font-normal italic text-gray-700 mb-2">
          ✅ Normal Italic
        </Text>
        <Text className="text-base font-medium italic text-gray-700 mb-2">
          ✅ Medium Italic
        </Text>
        <Text className="text-base font-bold italic text-gray-800">
          ✅ Bold Italic
        </Text>
      </View>
    </ScrollView>
  );
}
