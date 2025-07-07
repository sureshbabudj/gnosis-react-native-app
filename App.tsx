import 'react-native-gesture-handler';
import './global.css';

import {
  Alice_400Regular,
  useFonts as useAliceFonts,
} from '@expo-google-fonts/alice';
import {
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
  useFonts as useFiraSansFonts,
} from '@expo-google-fonts/fira-sans';
import {
  RopaSans_400Regular,
  RopaSans_400Regular_Italic,
  useFonts as useRopaSansFonts,
} from '@expo-google-fonts/ropa-sans';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StudyPerformanceScreen } from 'components/details';
import { GlanceScreen } from 'components/glance';
import { HomeScreen } from 'components/home';
import { LoadingScreen } from 'components/loading';
import { StatusBar } from 'expo-status-bar';
import theme from 'lib/theme';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFlashcardStore } from 'stores/translation-store';

import { AuthProvider, useAuth } from './components/auth-provider';
import { CustomTabBar } from './components/custom-toolbar';
import { ProfileScreen } from './components/profile';
import { SignInScreen } from './components/signin';
import { SignUpScreen } from './components/signup';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: true, // Reanimated runs in strict mode by default
});

// --- Navigation Setup ---
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen as any} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen as any} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  const { theme: selectedTheme } = useFlashcardStore();
  return (
    <Tab.Navigator
      tabBar={props => CustomTabBar({ selectedTheme, ...props })}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Glance" component={GlanceScreen} />
      <Tab.Screen name="Progress" component={StudyPerformanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function ThemeRoot({ children }: { children: React.ReactNode }) {
  const { theme: selectedTheme } = useFlashcardStore();
  // Pick background color from your theme object
  const backgroundColor = theme[selectedTheme]?.background || '#fff';
  return (
    <View
      className={`flex-1 ${selectedTheme === 'dark' ? 'dark' : 'light'}`}
      style={{ backgroundColor }}>
      <StatusBar
        style={selectedTheme === 'dark' ? 'light' : 'dark'}
        backgroundColor={backgroundColor}
      />
      {children}
    </View>
  );
}

function AppNavigation() {
  const { user, loading } = useAuth();
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <SafeAreaView className={`flex-1 bg-background`}>
        {user ? <MainNavigator /> : <AuthNavigator />}
      </SafeAreaView>
    </NavigationContainer>
  );
}

export default function App() {
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
    <SafeAreaProvider>
      <ThemeRoot>
        <GestureHandlerRootView className="flex-1">
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
        </GestureHandlerRootView>
      </ThemeRoot>
    </SafeAreaProvider>
  );
}
