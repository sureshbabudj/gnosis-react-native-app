import React, { useState, JSX, useRef } from "react";
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
import { AuthScreenProps } from "types";
import { AuthLogo } from "./auth-logo";
import { useAuth } from "./auth-provider";

export function SignUpScreen({
  navigation,
}: AuthScreenProps<"SignUp">): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const nameRef = useRef<TextInput>(null);

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
                ref={nameRef} // Attach ref
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground"
                placeholder="Enter your email"
                value={name}
                onChangeText={setName}
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()} // Move focus to password
                blurOnSubmit={false} // Keep keyboard open until 'done'
              />
            </View>

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
                blurOnSubmit={true}
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
