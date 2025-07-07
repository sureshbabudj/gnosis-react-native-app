import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type TabScreenProps<T extends keyof RootTabParamList> =
  BottomTabScreenProps<RootTabParamList, T>;

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

export type Flashcard = {
  id: string;
  german: string;
  translation: string;
  example: { original: string; translated: string };
  verbForms?: string[];
  synonyms?: string[];
  createdAt: Date;
  updatedAt?: Date;
  lastSeenDate: Date | null;
  seenCount: number;
  hardCount: number;
  easyCount: number;
  isNew: boolean;
  otherTranslations?: string[];
};

// theme
export type ThemeName = 'light' | 'dark';

// --- Study Metrics Types and Logic ---
export const MASTERED_THRESHOLD = 5;

export interface StudyMetricsResult {
  totalCardsInDeck: number;
  masteredCardsCount: number;
  masteredCardsPercentage: number;
  newCardsRemaining: number;
  avgHardAttemptsPerMasteredCard: number;
  avgSeenCountPerMasteredCard: number;
  reHardenedCardsCount: number;
  averageDailyReviews: number;
  currentHardCardsCount: number;
}
