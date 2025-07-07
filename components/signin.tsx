import { Ionicons } from '@expo/vector-icons';
import theme from 'lib/theme';
import { JSX, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFlashcardStore } from 'stores/translation-store';
import { AuthScreenProps } from 'types';

import { AuthLogo } from './auth-logo';
import { useAuth } from './auth-provider';

export function SignInScreen({
  navigation,
}: AuthScreenProps<'SignIn'>): JSX.Element {
  const { theme: selectedTheme } = useFlashcardStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
              <View className="relative">
                <TextInput
                  ref={passwordRef} // Attach ref
                  className="w-full px-4 py-3 pr-12 border border-border rounded-lg bg-card text-foreground"
                  placeholder="Enter your password (min 6 characters)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword} // Toggle visibility
                  textContentType="newPassword" // iOS autofill
                  autoComplete="new-password" // Android autofill
                  returnKeyType="next" // Show 'Next' button
                  onSubmitEditing={handleSignIn} // Handle sign in on submit
                  blurOnSubmit={true}
                />
                <TouchableOpacity
                  className="absolute right-0 top-0 z-10 w-12 h-12 flex items-center justify-center rounded-full"
                  onPress={() => setShowPassword(v => !v)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={theme[selectedTheme].primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className={`w-full my-8 py-3 rounded-lg ${
                loading ? 'bg-muted' : 'bg-primary'
              }`}
              onPress={handleSignIn}
              disabled={loading}>
              <Text className="text-primary-foreground text-center font-semibold text-lg">
                {loading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
              <Text className="text-muted-foreground">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text className="text-primary font-semibold ">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
