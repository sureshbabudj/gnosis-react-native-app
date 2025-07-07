import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as theme from 'lib/theme';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useFlashcardStore } from 'stores/translation-store';
import { type Flashcard } from 'types';

import Toast from '../lib/toast';

function VerbForms({ card }: { card: Flashcard }) {
  if (!card.verbForms) return null;

  const formsText: string[] = [];
  card.verbForms.forEach(form => {
    if (form.trim() !== '') {
      formsText.push(form);
    }
  });

  if (formsText.length === 0) return null;

  return (
    <View className="mt-2">
      <Text className="mt-4 text-base font-semibold text-card-foreground">
        Verb Forms
      </Text>
      {formsText.map(verb => (
        <Text key={verb} className="text-sm text-muted-foreground">
          {verb}
        </Text>
      ))}
    </View>
  );
}

export type FlashcardProps = {
  card: Flashcard;
} & React.ComponentProps<typeof View>;

// --- Flashcard Component ---
export function Flashcard({ card, className, ...rest }: FlashcardProps) {
  const { theme: selectedTheme } = useFlashcardStore();
  const [flipped, setFlipped] = useState(false);
  const rotate = useSharedValue(0);
  const [isAnimating, setAnimating] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    if (showActions) {
      setShowActions(false);
      return;
    }
    setFlipped(f => !f);
    setAnimating(true);
    rotate.value = withTiming(flipped ? 0 : 180, { duration: 500 });
    setTimeout(() => setAnimating(false), 500);
  };

  const handleLongPress = () => {
    setShowActions(true);
  };

  const handleHideActions = () => {
    setShowActions(false);
  };

  const handleEdit = () => {
    setShowActions(false);
    Alert.alert('Edit', 'Edit action pressed');
    handleHideActions();
  };

  const removeCard = () => {
    useFlashcardStore.getState().deleteCard(card.id);
    Toast.show('The card has been deleted.', Toast.LONG);
  };

  const handleDelete = () => {
    // confirm deletion
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        {
          text: 'Cancel',
          onPress: () => handleHideActions(),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            removeCard();
            handleHideActions();
          },
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
    handleHideActions();
  };

  const handleFavorite = () => {
    setShowActions(false);
    Alert.alert('Favorite', 'Favorite action pressed');
    handleHideActions();
  };

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotate.value}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${rotate.value + 180}deg` }],
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
  }));

  return (
    <View className={`w-full min-h-72 relative mb-6 ${className}`} {...rest}>
      <Pressable
        onPress={handleFlip}
        onLongPress={handleLongPress}
        delayLongPress={500}
        className={`flex-1 overflow-hidden rounded-xl ${
          !isAnimating
            ? 'bg-card shadow shadow-gray-800 border border-border'
            : ''
        } ${showActions ? 'border-2 border-secondary-foreground' : ''}`}
        pointerEvents="auto">
        {/* Action bar */}
        {showActions && (
          <View
            className="absolute top-2 right-2 z-10 flex flex-row items-center justify-center bg-card rounded-full"
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ elevation: 4 }}>
            <Pressable
              onPress={handleEdit}
              hitSlop={10}
              className="border-r border-primary-foreground px-4 py-2">
              <Ionicons
                name="create-outline"
                size={24}
                color={theme[selectedTheme].primary}
              />
            </Pressable>
            <Pressable
              onPress={handleFavorite}
              hitSlop={10}
              className="border-r border-primary-foreground px-4 py-2">
              <Ionicons
                name="star-outline"
                size={24}
                color={theme[selectedTheme].accentForeground}
              />
            </Pressable>
            <Pressable
              onPress={handleDelete}
              hitSlop={10}
              className="px-4 py-2">
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme[selectedTheme].destructive}
              />
            </Pressable>
          </View>
        )}

        <Animated.View
          style={[frontAnimatedStyle]}
          pointerEvents="box-none"
          className="rounded-xl overflow-hidden">
          <LinearGradient
            colors={[
              theme[selectedTheme].card,
              theme[selectedTheme].primaryForeground,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            locations={[0, 1]}
            className="w-full flex-1 overflow-auto p-4">
            <View className="flex-grow items-center justify-center">
              <Text className="text-2xl font-extrabold text-center text-primary mb-2">
                {card.german}
              </Text>
              <Text className="text-base text-muted-foreground text-center">
                Click to reveal
              </Text>
            </View>
            <View className="flex flex-row items-center justify-center">
              <Text className="flex-none text-base font-light-italic text-muted-foreground text-center mt-auto">
                Long press to show actions.{' '}
              </Text>
              <Ionicons
                name="ellipsis-vertical"
                size={12}
                color={theme[selectedTheme].primary}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[backAnimatedStyle]}
          pointerEvents="box-none"
          className="bg-card border border-border rounded-xl p-4 flex-1 justify-center w-full">
          <ScrollView>
            <Text className="text-xl font-semibold text-card-foreground text-center">
              {card.translation}
            </Text>
            <Text className="text-lg first-line:italic mt-2 text-muted-foreground">
              🇩🇪 "{card.example.original}"
            </Text>
            <Text className="text-base first-line:italic mt-2 text-muted-foreground">
              🇬🇧 "{card.example.translated}"
            </Text>
            <VerbForms card={card} />
            {card.synonyms && (
              <Text className="mt-1 text-sm text-muted-foreground">
                Synonyms: {card.synonyms.join(', ')}
              </Text>
            )}
            {card.otherTranslations && card.otherTranslations.length !== 0 && (
              <Text className="text-sm text-muted-foreground mt-1">
                `Other Translations: ${card.otherTranslations.join(', ')}`
              </Text>
            )}
          </ScrollView>
        </Animated.View>
      </Pressable>
    </View>
  );
}
