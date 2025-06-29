import "./global.css";

import React, {
  useState,
  useEffect,
  JSX,
  createContext,
  useContext,
} from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createBottomTabNavigator,
  type BottomTabScreenProps,
  type BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

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

// Types
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Explore: undefined;
};

type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;
type TabScreenProps<T extends keyof RootTabParamList> = BottomTabScreenProps<
  RootTabParamList,
  T
>;

interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

// Create navigators
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateUserId = (): string => {
  return `user_${Date.now()}`;
};

async function hashPassword(password: string): Promise<string> {
  return `hash_${password}_${Date.now()}`;
}

const verifyPassword = (password: string, hash: string) => {
  const [, originalPassword] = hash.split("_");
  return password === originalPassword;
};

// Storage utilities
const USERS_STORAGE_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

const saveUser = async (user: User): Promise<void> => {
  try {
    const existingUsers = await getUsers();
    const updatedUsers = [...existingUsers, user];
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

const getUsers = async (): Promise<User[]> => {
  try {
    const users = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

const saveCurrentUser = async (user: User): Promise<void> => {
  try {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Error saving current user:", error);
    throw error;
  }
};

const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!userString) return null;

    const userData = JSON.parse(userString);
    const users = await getUsers();
    const fullUser = users.find((u) => u.id === userData.id);

    return fullUser || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error("Error clearing current user:", error);
    throw error;
  }
};

// Auth Provider Component
function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking current user:", error);
      } finally {
        setLoading(false);
      }
    };
    checkCurrentUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = await getUsers();
      const foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!foundUser) {
        Alert.alert("Error", "User not found");
        return false;
      }

      const isValidPassword = await verifyPassword(
        password,
        foundUser.passwordHash
      );
      if (!isValidPassword) {
        Alert.alert("Error", "Invalid password");
        return false;
      }

      await saveCurrentUser(foundUser);
      setUser(foundUser);
      return true;
    } catch (error) {
      Alert.alert("Error", "Sign in failed");
      console.error("Sign in error:", error);
      return false;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const users = await getUsers();
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        Alert.alert("Error", "User already exists");
        return false;
      }

      const userId = generateUserId();
      const passwordHash = await hashPassword(password);

      const newUser: User = {
        id: userId,
        name,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
      };

      await saveUser(newUser);
      await saveCurrentUser(newUser);
      setUser(newUser);
      Alert.alert("Success", "Account created successfully!");
      return true;
    } catch (error) {
      Alert.alert("Error", "Sign up failed");
      console.error("Sign up error:", error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await clearCurrentUser();
      setUser(null);
      Alert.alert("Success", "Signed out successfully");
    } catch (error) {
      Alert.alert("Error", "Sign out failed");
      console.error("Sign out error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Logo for Auth Screens
const AuthLogo = () => (
  <View className="mb-8">
    <Text className="text-7xl leading-tight text-center mx-auto rounded-full bg-primary-foreground p-4 ">
      🧠
    </Text>
    <Text className="text-4xl text-primary text-center font-alice">Gnosis</Text>
    <Text className="text-muted-foreground text-center font-ropa">
      Gateway to a secure and decentralized future
    </Text>
  </View>
);

// Sign In Screen
function SignInScreen({ navigation }: AuthScreenProps<"SignIn">): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <ScrollView className="flex-1 bg-background">
        <View className="flex-1 justify-center px-6 py-12">
          <AuthLogo />

          <Text className="text-3xl font-fira-sans-bold text-foreground text-center mb-2">
            Welcome Back
          </Text>
          <View className="mb-8">
            <Text className="text-muted-foreground text-center">
              Sign in to your account
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Email
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Password
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className={`w-full my-8 py-3 rounded-lg ${
                loading ? "bg-muted" : "bg-primary"
              }`}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text className="text-primary-foreground text-center font-semibold text-lg">
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-muted-foreground">
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text className="text-primary font-semibold ">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Sign Up Screen
function SignUpScreen({ navigation }: AuthScreenProps<"SignUp">): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!agreeTerms) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    await signUp(name, email, password);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <ScrollView className="flex-1 bg-background">
        <View className="flex-1 justify-center px-6 py-12">
          <AuthLogo />
          <View className="mb-8">
            <Text className="text-3xl font-bold text-foreground text-center mb-2">
              Create Account
            </Text>
            <Text className="text-muted-foreground text-center">
              Sign up to get started
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Full Name
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Email
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Password
              </Text>
              <TextInput
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground"
                placeholder="Enter your password (min 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="flex-row items-center mt-4"
              onPress={() => setAgreeTerms(!agreeTerms)}
            >
              <View
                className={`w-5 h-5 border-2 rounded mr-3 items-center justify-center ${
                  agreeTerms ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {agreeTerms && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </View>
              <Text className="text-muted-foreground flex-1">
                I agree to the Terms and Conditions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`w-full py-3 rounded-lg mt-6 ${
                loading ? "bg-muted" : "bg-primary"
              }`}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text className="text-primary-foreground text-center font-semibold text-lg">
                {loading ? "Creating Account..." : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-muted-foreground">
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text className="text-primary font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Main App Screens (after authentication)
function HomeScreen({ navigation }: TabScreenProps<"Home">): JSX.Element {
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
        <Text className="text-base font-bold text-gray-800 mb-2">
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

function ProfileScreen({ navigation }: TabScreenProps<"Profile">): JSX.Element {
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

function SettingsScreen({
  navigation,
}: TabScreenProps<"Settings">): JSX.Element {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-foreground">
        Welcome to Settings
      </Text>
    </View>
  );
}

function ExploreScreen({ navigation }: TabScreenProps<"Explore">): JSX.Element {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-bold text-foreground">
        Welcome to Explore
      </Text>
    </View>
  );
}

// Loading Screen
function LoadingScreen(): JSX.Element {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <AuthLogo />
      <Text className="text-lg text-muted-foreground">Loading...</Text>
    </View>
  );
}

function AuthNavigator(): JSX.Element {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): JSX.Element {
  const tabs = [
    { name: "Home", icon: "home", activeIcon: "home", label: "Home" },
    {
      name: "Profile",
      icon: "person-outline",
      activeIcon: "person",
      label: "Profile",
    },
    {
      name: "Settings",
      icon: "settings-outline",
      activeIcon: "settings",
      label: "Settings",
    },
    {
      name: "Explore",
      icon: "compass-outline",
      activeIcon: "compass",
      label: "Explore",
    },
  ];

  return (
    <View className="flex-row bg-background border-t-2 border-border px-4">
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const routeName = state.routes[index].name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(routeName);
          }
        };

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={onPress}
            className={`flex-1 items-center justify-center py-2 rounded-xl transition-all  ${
              isFocused
                ? "bg-primary/10 animate-[wiggle_1s_ease-in-out_500ms]"
                : "bg-transparent"
            }`}
          >
            <View className={`items-center justify-center w-10 h-10 `}>
              <Ionicons
                name={isFocused ? (tab.activeIcon as any) : (tab.icon as any)}
                size={24}
                color={isFocused ? "#222" : "#888"}
              />
            </View>
            <Text
              className={`text-xs font-medium ${
                isFocused ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
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

  console.log("✅ All fonts loaded successfully!");

  return (
    <AuthProvider>
      <SafeAreaView className="flex-1 bg-white">
        <AppNavigation />
      </SafeAreaView>
    </AuthProvider>
  );
}
