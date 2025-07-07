import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  browserSessionPersistence,
  //@ts-ignore
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyD-507dBGz0x5B6aMnDAVQA8fUXyC6CRxg',
  authDomain: 'vocab-flip-ai.firebaseapp.com',
  projectId: 'vocab-flip-ai',
  storageBucket: 'vocab-flip-ai.firebasestorage.app',
  messagingSenderId: '724258722104',
  appId: '1:724258722104:web:acdc1c29f249cf26f5b1cd',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence:
    Platform.OS === 'web'
      ? browserSessionPersistence
      : getReactNativePersistence(AsyncStorage),
});
