import {
  clearCurrentUser,
  generateUserId,
  getCurrentUser,
  getUsers,
  hashPassword,
  saveCurrentUser,
  saveUser,
  verifyPassword,
} from "lib/storage";
import React, {
  useState,
  useEffect,
  JSX,
  useContext,
  createContext,
} from "react";
import { Alert } from "react-native";
import { AuthContextType, User } from "types";

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
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
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
