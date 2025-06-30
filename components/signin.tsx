import { JSX, useRef, useState } from "react";
import { AuthScreenProps } from "types";
import { useAuth } from "./auth-provider";
import {
  Alert,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import { AuthLogo } from "./auth-logo";

export function SignInScreen({
  navigation,
}: AuthScreenProps<"SignIn">): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

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

          <Text className="text-3xl font-semibold text-foreground text-center mb-2">
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
                ref={emailRef}
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
                autoComplete="email"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Password
              </Text>
              <TextInput
                ref={passwordRef} // Attach ref
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground"
                placeholder="Enter your password (min 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry // Hide password characters
                textContentType="newPassword" // iOS autofill
                autoComplete="new-password" // Android autofill
                returnKeyType="next" // Show 'Next' button
                onSubmitEditing={handleSignIn} // Handle sign in on submit
                blurOnSubmit={true}
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
