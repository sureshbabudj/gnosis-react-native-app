import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import React, {
  createContext,
  JSX,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Alert } from 'react-native';
import type { AuthContextType, User as AppUser } from 'types';

import { auth } from '../firebase.config';
import { useFlashcardStore } from '../stores/translation-store';

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            name:
              firebaseUser.displayName ||
              firebaseUser.email?.split('@')[0] ||
              '',
            email: firebaseUser.email || '',
            passwordHash: '', // Not available from Firebase
            createdAt: firebaseUser.metadata.creationTime || '',
          });
          // Subscribe to Firestore after user is authenticated
          useFlashcardStore.getState().subscribeToFirestore?.();
        } else {
          setUser(null);
          // Optionally unsubscribe from Firestore on logout
          useFlashcardStore.getState().unsubscribeFromFirestore?.();
        }
        setLoading(false);
      },
    );
    return () => {
      unsubscribe();
      useFlashcardStore.getState().unsubscribeFromFirestore?.();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error: any) {
      console.log('[AuthProvider] signIn error', error);
      Alert.alert('Error', error.message || 'Sign in failed');
      return false;
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Set displayName immediately after user creation
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      Alert.alert('Success', 'Account created successfully!');
      return true;
    } catch (error: any) {
      console.log('[AuthProvider] signUp error', error);
      Alert.alert('Error', error.message || 'Sign up failed');
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      Alert.alert('Success', 'Signed out successfully');
    } catch (error: any) {
      console.log('[AuthProvider] signOut error', error);
      Alert.alert('Error', error.message || 'Sign out failed');
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
