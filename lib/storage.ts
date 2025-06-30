import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "types";

// Utility function to generate a unique user ID
export const generateUserId = (): string => {
  return `user_${Date.now()}`;
};

// Utility function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return `hash_${password}_${Date.now()}`;
}

export const verifyPassword = (password: string, hash: string) => {
  const [, originalPassword] = hash.split("_");
  return password === originalPassword;
};

// Storage utilities
const USERS_STORAGE_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export const saveUser = async (user: User): Promise<void> => {
  try {
    const existingUsers = await getUsers();
    const updatedUsers = [...existingUsers, user];
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

export const saveCurrentUser = async (user: User): Promise<void> => {
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

export const getCurrentUser = async (): Promise<User | null> => {
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

export const clearCurrentUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.error("Error clearing current user:", error);
    throw error;
  }
};
