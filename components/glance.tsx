import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useFlashcardStore } from 'stores/translation-store';

import { Flashcard } from './flash-card';
import { HeaderBar } from './header-bar';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

export function GlanceScreen() {
  const isFocused = useIsFocused();
  const cards = useFlashcardStore(s => s.cards);
  const updateCard = useFlashcardStore(s => s.updateCard);
  const [index, setIndex] = useState(0);
  const [hard, setHard] = useState(0);
  const [easy, setEasy] = useState(0);

  const translateX = useSharedValue(0);
  const rotateZ = useSharedValue(0);

  const handleSwipe = (direction: 'left' | 'right') => {
    const card = cards[index];
    if (!card) return;
    // Update stats
    updateCard(card.id, prev => ({
      ...prev,
      seenCount: (prev.seenCount ?? 0) + 1,
      hardCount:
        direction === 'left' ? (prev.hardCount ?? 0) + 1 : prev.hardCount,
      easyCount:
        direction === 'right' ? (prev.easyCount ?? 0) + 1 : prev.easyCount,
      lastSeenDate: new Date(),
      isNew: false,
    }));
    if (direction === 'left') setHard(prev => prev + 1);
    if (direction === 'right') setEasy(prev => prev + 1);
    setIndex(prev => prev + 1);
    translateX.value = 0;
    rotateZ.value = 0;
  };

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
      rotateZ.value = event.translationX / 20;
    })
    .onEnd(() => {
      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-width * 1.5, {}, () =>
          runOnJS(handleSwipe)('left'),
        );
      } else if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(width * 1.5, {}, () =>
          runOnJS(handleSwipe)('right'),
        );
      } else {
        translateX.value = withSpring(0);
        rotateZ.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotateZ.value}deg` },
    ],
  }));

  const handleRestart = () => {
    setIndex(0);
    setHard(0);
    setEasy(0);
  };

  useEffect(() => {
    if (isFocused) {
      handleRestart();
    }
  }, [isFocused]);

  return (
    <View className="flex-1 bg-background" data-focused={isFocused}>
      <HeaderBar />
      {cards.length === 0 ? (
        <View className="flex-1 items-center justify-center bg-background">
          <Text className="text-8xl leading-loose font-bold text-primary mb-4">
            ☹️
          </Text>
          <Text className="text-2xl font-bold text-primary mb-8">
            No cards available.
          </Text>
          <Text className="text-lg text-muted-foreground">
            Please add some cards to start learning.
          </Text>
        </View>
      ) : (
        <GestureHandlerRootView className="flex-1 flex flex-col">
          <View className="items-center justify-center h-3/5 flex-grow bg-background">
            {cards[index] ? (
              <>
                {/* Deck-like background cards */}
                <View className="absolute w-[90%] h-[90%] items-center justify-center">
                  <View className="absolute w-full h-full bg-card rounded-xl shadow-md scale-95 translate-y-2 opacity-80" />
                  <View className="absolute w-full h-full bg-card rounded-xl shadow-md scale-90 translate-y-4 opacity-60" />
                </View>

                {/* Swipeable top card */}
                <GestureDetector gesture={panGesture}>
                  <Animated.View
                    style={[animatedStyle]}
                    className="absolute w-[90%] h-[88%]">
                    <View className="w-full h-full flex flex-col items-center justify-center">
                      <Flashcard
                        card={cards[index]}
                        className="flex-grow self-stretch h-full"
                      />
                    </View>
                  </Animated.View>
                </GestureDetector>
              </>
            ) : (
              <View className="flex-1 items-center justify-center gap-8">
                <Text className="text-5xl leading-loose font-bold text-primary">
                  🎉
                </Text>
                <Text className="text-3xl font-extrabold text-primary">
                  Great Job!
                </Text>
                <Text className="text-xl font-bold text-primary">
                  You have completed all cards! 👍
                </Text>
              </View>
            )}
          </View>

          {/* Progress Section */}
          <View className="flex-row justify-around items-center h-[20%] border-t border-border">
            <Text className="text-destructive font-bold text-lg">
              Hard: {hard}
            </Text>
            <TouchableOpacity
              onPress={handleRestart}
              className="p-3 bg-primary-foreground rounded-full shadow">
              <Ionicons name="refresh" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-green-500 font-bold text-lg">
              Easy: {easy}
            </Text>
          </View>
        </GestureHandlerRootView>
      )}
    </View>
  );
}
