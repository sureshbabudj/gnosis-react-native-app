import theme from 'lib/theme';
import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import { translateText } from 'services/translation-service';
import { useFlashcardStore } from 'stores/translation-store';

import Toast from '../lib/toast';
import { AnimatedIcon } from './animated-icon';

export function AddCard({ navigation }: { navigation?: any }) {
  const { theme: selectedTheme } = useFlashcardStore();
  const [loading, setLoading] = useState(false);
  const [word, setWord] = useState('');
  const addCard = useFlashcardStore(state => state.addCard);

  const handleAdd = async () => {
    if (word.trim() === '') {
      // Handle empty input case
      Alert.alert('Error', 'Please enter a word to add.');
      return;
    }
    setLoading(true);
    try {
      const data = await translateText(word);
      addCard({
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSeenDate: null,
        seenCount: 0,
        hardCount: 0,
        easyCount: 0,
        isNew: false,
        german: word,
        translation: data.translation,
        example: {
          original: data.example?.original || '',
          translated: data.example?.translated || '',
        },
        verbForms: data.verbForms,
        synonyms: data.synonyms,
        otherTranslations: data.otherTranslations,
      });
      setWord(''); // Clear input after adding
      Toast.show('Card added successfully!', Toast.LONG);
      navigation?.goBack();
    } catch (error) {
      Toast.show('Failed to add card. Please try again.', Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="m-2 flex-1 relative">
      <TextInput
        placeholder="Enter German word"
        value={word}
        onChangeText={setWord}
        className="border border-input py-4 px-4 text-md rounded-full mb-4 bg-background text-foreground"
        placeholderTextColor={theme[selectedTheme].mutedForeground}
        onSubmitEditing={handleAdd}
      />
      <TouchableOpacity
        onPress={handleAdd}
        className="p-2 bg-muted-foreground rounded-full items-center justify-center absolute top-[.4rem] right-1">
        <AnimatedIcon
          name={loading ? 'reload' : 'add'}
          size={24}
          color={theme[selectedTheme].background}
          spinning={loading}
        />
      </TouchableOpacity>
    </View>
  );
}
