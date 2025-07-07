import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import theme from 'lib/theme';
import { calculateStudyMetrics } from 'lib/utils';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useFlashcardStore } from 'stores/translation-store';

import { HeaderBar } from './header-bar';

export function StudyPerformanceScreen() {
  const isFocused = useIsFocused();
  const cards = useFlashcardStore(s => s.cards);
  const [metrics, setMetrics] = useState(calculateStudyMetrics(cards));
  const { theme: selectedTheme } = useFlashcardStore();

  useEffect(() => {
    if (isFocused) {
      setMetrics(calculateStudyMetrics(cards));
    }
  }, [isFocused, cards]);

  return (
    <View className="flex-1 bg-background" data-focused={isFocused}>
      <HeaderBar />
      <ScrollView className="flex-1 p-4 pb-12">
        {/* Your Progress */}
        <View className="bg-card rounded-xl p-4 shadow-md mb-6">
          <Text className="text-xl font-bold text-primary mb-2 flex-row items-center">
            <Ionicons name="bar-chart" size={22} color="#6366f1" /> Your
            Progress
          </Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg text-primary">Total Words</Text>
            <Text className="text-2xl font-extrabold text-primary">
              {metrics.totalCardsInDeck}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg text-primary flex-row items-center">
              <Ionicons
                name="star"
                size={18}
                color={theme[selectedTheme].accent}
              />{' '}
              Mastered Vocabulary
            </Text>
            <Text className="text-2xl  font-extrabold text-yellow-400">
              {metrics.masteredCardsCount}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-primary">Mastered %</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-xl font-bold text-primary">
                {metrics.masteredCardsPercentage}%
              </Text>
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            </View>
          </View>
        </View>

        {/* Learning Efficiency */}
        <View className="bg-card rounded-xl p-4 shadow-md mb-6">
          <Text className="text-xl font-bold text-primary mb-2 flex-row items-center">
            <Ionicons name="flash" size={22} color="#f472b6" /> Learning
            Efficiency
          </Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-primary text-lg">
              Avg. Hard Attempts (Mastered)
            </Text>
            <Text className="text-xl font-bold text-destructive">
              {metrics.avgHardAttemptsPerMasteredCard.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-primary text-lg">
              Avg. Seen Count (Mastered)
            </Text>
            <Text className="ttext-xl font-bold text-primary">
              {metrics.avgSeenCountPerMasteredCard.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-primary text-lg">New Words Remaining</Text>
            <Text className="text-xl font-bold text-blue-500">
              {metrics.newCardsRemaining}
            </Text>
          </View>
        </View>

        {/* Engagement Insights */}
        <View className="bg-card rounded-xl p-4 shadow-md">
          <Text className="text-primary text-xl font-bold text-primary mb-2 flex-row items-center">
            <Ionicons name="analytics" size={22} color="#38bdf8" /> Engagement
            Insights
          </Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-primary text-lg flex-row items-center">
              <Ionicons name="repeat" size={18} color="#f87171" /> Re-hardened
              Cards
            </Text>
            <Text className="text-primary text-xl font-bold text-red-400">
              {metrics.reHardenedCardsCount}
            </Text>
          </View>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-primary text-lg">Current Hard Cards</Text>
            <Text className="text-primary text-xl font-bold text-destructive">
              {metrics.currentHardCardsCount}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-primary">Avg. Daily Reviews</Text>
            <Text className="text-xl font-bold text-primary">
              {metrics.averageDailyReviews.toFixed(2)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
