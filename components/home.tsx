import React from 'react';
import { ScrollView, View } from 'react-native';
import { useFlashcardStore } from 'stores/translation-store';

import { AddCard } from './add-card';
import { FlashcardList } from './flash-card-list';
import { HeaderBar } from './header-bar';

export function HomeScreen({ navigation: _n }: any) {
  const cards = useFlashcardStore(state => state.cards);

  const sortedCards = [...cards].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <View className="flex-1 bg-background">
      <HeaderBar />
      <View className="flex-row px-4 items-center justify-between mb-2">
        <AddCard />
      </View>
      <ScrollView className="flex-1 px-2">
        <FlashcardList cards={sortedCards} />
      </ScrollView>
    </View>
  );
}
