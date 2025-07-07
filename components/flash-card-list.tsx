import React from 'react';
import { Text, View } from 'react-native';
import { type Flashcard as FlashCardType } from 'types';

import { Flashcard } from './flash-card';

// --- Flashcard List ---
export function FlashcardList({ cards }: { cards: FlashCardType[] }) {
  // If no cards, show a message
  if (cards.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-muted-foreground">
          No flashcards available. Add some to get started!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 mx-4">
      {cards.map(card => (
        <Flashcard key={card.id} card={card} className="mx-auto" />
      ))}
    </View>
  );
}
