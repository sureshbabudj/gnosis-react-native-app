import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { type Flashcard, ThemeName } from 'types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { app, auth } from '../firebase.config';

const db = getFirestore(app);

function getUserCardsCollection() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return collection(db, 'users', user.uid, 'cards');
}

type FlashcardStore = {
  cards: Flashcard[];
  addCard: (card: Flashcard) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  updateCard: (
    id: string,
    updater: (card: Flashcard) => Flashcard,
  ) => Promise<void>;
  theme: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  syncFromFirestore: () => Promise<void>;
  subscribeToFirestore?: () => void;
  unsubscribeFromFirestore?: () => void;
};

const zustandAsyncStorage: import('zustand/middleware').PersistStorage<FlashcardStore> =
  {
    getItem: async name => {
      const value = await AsyncStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: async (name, value) => {
      await AsyncStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: async name => {
      await AsyncStorage.removeItem(name);
    },
  };

// Utility to remove undefined fields from an object (shallow)
function removeUndefinedFields<T extends object>(obj: T): T {
  const clean: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] !== undefined) {
        clean[key] = obj[key];
      }
    }
  }
  return clean;
}

export const useFlashcardStore = create<FlashcardStore>()(
  persist(
    (set, get) => {
      let unsubscribe: (() => void) | null = null;
      return {
        cards: [],
        addCard: async card => {
          set(state => ({ cards: [...state.cards, card] }));
          // Local first, then Firestore
          try {
            const col = getUserCardsCollection();
            const cleanCard = removeUndefinedFields(card);
            await setDoc(doc(col, card.id), cleanCard);
          } catch (e) {
            console.log('Firestore addCard error:', e);
          }
        },
        deleteCard: async id => {
          set(state => ({ cards: state.cards.filter(c => c.id !== id) }));
          try {
            const col = getUserCardsCollection();
            await deleteDoc(doc(col, id));
          } catch (e) {
            console.log('Firestore deleteCard error:', e);
          }
        },
        updateCard: async (id, updater) => {
          set(state => ({
            cards: state.cards.map(card =>
              card.id === id ? updater(card) : card,
            ),
          }));
          try {
            const col = getUserCardsCollection();
            const card = get().cards.find(c => c.id === id);
            if (card) {
              const cleanCard = removeUndefinedFields(card);
              await setDoc(doc(col, id), cleanCard);
            }
          } catch (e) {
            console.log('Firestore updateCard error:', e);
          }
        },
        theme: 'light',
        setTheme: (themeName: ThemeName) => set({ theme: themeName }),
        syncFromFirestore: async () => {
          try {
            const col = getUserCardsCollection();
            // Get the latest updatedAt from local cards (assume updatedAt is ISO string)
            const localCards = get().cards;
            const latest = localCards.reduce(
              (max: string | null, c) => {
                if (
                  typeof c.updatedAt === 'string' &&
                  (typeof max !== 'string' ||
                    (typeof max === 'string' && String(c.updatedAt) > max))
                ) {
                  return c.updatedAt;
                }
                return max;
              },
              null as string | null,
            );
            let q: any = col;
            if (latest) {
              const { query, where } = await import('firebase/firestore');
              q = query(col, where('updatedAt', '>', latest));
            }
            const snap = await getDocs(q);
            const newCards: Flashcard[] = [];
            snap.forEach(snapshotDoc =>
              newCards.push(snapshotDoc.data() as Flashcard),
            );
            // Merge new/updated cards into local cards
            const merged = [...localCards];
            newCards.forEach(newCard => {
              const idx = merged.findIndex(c => c.id === newCard.id);
              if (idx > -1) {
                merged[idx] = newCard;
              } else {
                merged.push(newCard);
              }
            });
            set({ cards: merged });
          } catch (e) {
            console.error('Firestore incremental sync error:', e);
          }
        },
        // Real-time Firestore sync
        subscribeToFirestore: () => {
          if (unsubscribe) unsubscribe();
          try {
            const col = getUserCardsCollection();
            unsubscribe = onSnapshot(col, snap => {
              const cards: Flashcard[] = [];
              snap.forEach(snapshotDoc =>
                cards.push(snapshotDoc.data() as Flashcard),
              );
              set({ cards });
            });
          } catch (e) {
            console.error('Firestore subscribe error:', e);
          }
        },
        unsubscribeFromFirestore: () => {
          if (unsubscribe) unsubscribe();
          unsubscribe = null;
        },
      };
    },
    {
      name: 'flashcard-storage',
      storage: zustandAsyncStorage,
      // Remove automatic Firestore subscription on hydration
    },
  ),
);
