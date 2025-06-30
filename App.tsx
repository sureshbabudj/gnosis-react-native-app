import "./global.css";

import React, { JSX } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import {
  Alice_400Regular,
  useFonts as useAliceFonts,
} from "@expo-google-fonts/alice";
import {
  RopaSans_400Regular,
  RopaSans_400Regular_Italic,
  useFonts as useRopaSansFonts,
} from "@expo-google-fonts/ropa-sans";
import {
  useFonts as useFiraSansFonts,
  FiraSans_100Thin,
  FiraSans_100Thin_Italic,
  FiraSans_200ExtraLight,
  FiraSans_200ExtraLight_Italic,
  FiraSans_300Light,
  FiraSans_300Light_Italic,
  FiraSans_400Regular,
  FiraSans_400Regular_Italic,
  FiraSans_500Medium,
  FiraSans_500Medium_Italic,
  FiraSans_600SemiBold,
  FiraSans_600SemiBold_Italic,
  FiraSans_700Bold,
  FiraSans_700Bold_Italic,
  FiraSans_800ExtraBold,
  FiraSans_800ExtraBold_Italic,
  FiraSans_900Black,
  FiraSans_900Black_Italic,
} from "@expo-google-fonts/fira-sans";
import { LoadingScreen } from "components/loading";
import { AuthProvider, useAuth } from "components/auth-provider";
import { HomeScreen } from "components/home";
import { ProfileScreen } from "components/profile";
import { SettingsScreen } from "components/settings";
import { ExploreScreen } from "components/explore";
import { CustomTabBar } from "components/custom-toolbar";
import { AuthStackParamList, RootTabParamList } from "types";
import { SignInScreen } from "components/signin";
import { SignUpScreen } from "components/signup";

// Create navigators
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function AuthNavigator(): JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Main Tab Navigator
function MainNavigator(): JSX.Element {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
    </Tab.Navigator>
  );
}

// App Navigation Component
function AppNavigation(): JSX.Element {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

// Main App Component
export default function App(): JSX.Element {
  const [isFiraSansLoaded, firaSansErr] = useFiraSansFonts({
    FiraSans_100Thin,
    FiraSans_100Thin_Italic,
    FiraSans_200ExtraLight,
    FiraSans_200ExtraLight_Italic,
    FiraSans_300Light,
    FiraSans_300Light_Italic,
    FiraSans_400Regular,
    FiraSans_400Regular_Italic,
    FiraSans_500Medium,
    FiraSans_500Medium_Italic,
    FiraSans_600SemiBold,
    FiraSans_600SemiBold_Italic,
    FiraSans_700Bold,
    FiraSans_700Bold_Italic,
    FiraSans_800ExtraBold,
    FiraSans_800ExtraBold_Italic,
    FiraSans_900Black,
    FiraSans_900Black_Italic,
  });

  const [isAliceLoaded, aliceError] = useAliceFonts({
    Alice_400Regular,
  });

  const [isRopaSansLoaded, ropaSansError] = useRopaSansFonts({
    RopaSans_400Regular,
    RopaSans_400Regular_Italic,
  });

  if (
    !isFiraSansLoaded ||
    firaSansErr ||
    !isAliceLoaded ||
    aliceError ||
    !isRopaSansLoaded ||
    ropaSansError
  ) {
    return <LoadingScreen />;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1 bg-white">
          <AppNavigation />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
