// lib/utils.ts
// Utility function for selecting and ordering flashcards for display

import { Flashcard, MASTERED_THRESHOLD, StudyMetricsResult } from 'types';

export const MAX_DISPLAY_CARDS = 10;

/**
 * Selects and orders flashcards for display based on novelty, difficulty, and usage stats.
 * @param allFlashcards Array of all flashcards in the user's deck
 * @param selectedTheme (optional) Theme string for context/logging
 * @returns Array of flashcards to display (max MAX_DISPLAY_CARDS)
 */
export function getCardsToDisplay(allFlashcards: Flashcard[]): Flashcard[] {
  if (allFlashcards.length <= MAX_DISPLAY_CARDS) {
    return allFlashcards;
  }

  // Categorize cards
  const newCards = allFlashcards.filter(card => card.isNew);
  const hardCards = allFlashcards.filter(
    card => card.seenCount > 0 && card.hardCount > card.easyCount,
  );
  const easyCards = allFlashcards.filter(
    card =>
      card.seenCount > 0 && card.easyCount >= card.hardCount && !card.isNew,
  );

  // Sort hardCards: hardCount desc, then seenCount asc, then lastSeenDate asc
  hardCards.sort((a, b) => {
    if (b.hardCount !== a.hardCount) return b.hardCount - a.hardCount;
    if (a.seenCount !== b.seenCount) return a.seenCount - b.seenCount;
    if (a.lastSeenDate && b.lastSeenDate) {
      return a.lastSeenDate.getTime() - b.lastSeenDate.getTime();
    }
    if (a.lastSeenDate) return -1;
    if (b.lastSeenDate) return 1;
    return 0;
  });

  // Sort easyCards: seenCount asc, then lastSeenDate asc
  easyCards.sort((a, b) => {
    if (a.seenCount !== b.seenCount) return a.seenCount - b.seenCount;
    if (a.lastSeenDate && b.lastSeenDate) {
      return a.lastSeenDate.getTime() - b.lastSeenDate.getTime();
    }
    if (a.lastSeenDate) return -1;
    if (b.lastSeenDate) return 1;
    return 0;
  });

  // Edge case: all cards are easy and none are new
  if (hardCards.length === 0 && newCards.length === 0) {
    return easyCards.slice(0, MAX_DISPLAY_CARDS);
  }

  // Interleave: after every 4 hard cards, insert 1 new card
  const displayCards: Flashcard[] = [];
  const usedCardIds = new Set<string>();
  let hardIndex = 0;
  let newIndex = 0;

  while (
    displayCards.length < MAX_DISPLAY_CARDS &&
    (hardIndex < hardCards.length || newIndex < newCards.length)
  ) {
    if (displayCards.length % 5 === 4 && newIndex < newCards.length) {
      // Every 5th card (0-indexed: 4, 9, ...), insert a new card
      const card = newCards[newIndex++];
      if (!usedCardIds.has(card.id)) {
        displayCards.push(card);
        usedCardIds.add(card.id);
      }
    } else if (hardIndex < hardCards.length) {
      const card = hardCards[hardIndex++];
      if (!usedCardIds.has(card.id)) {
        displayCards.push(card);
        usedCardIds.add(card.id);
      }
    } else if (newIndex < newCards.length) {
      const card = newCards[newIndex++];
      if (!usedCardIds.has(card.id)) {
        displayCards.push(card);
        usedCardIds.add(card.id);
      }
    } else {
      break;
    }
  }

  // Fill with remaining hard cards if needed
  while (
    displayCards.length < MAX_DISPLAY_CARDS &&
    hardIndex < hardCards.length
  ) {
    const card = hardCards[hardIndex++];
    if (!usedCardIds.has(card.id)) {
      displayCards.push(card);
      usedCardIds.add(card.id);
    }
  }

  // Fill with easy cards (least seen) if still not enough
  for (const card of easyCards) {
    if (displayCards.length >= MAX_DISPLAY_CARDS) break;
    if (!usedCardIds.has(card.id)) {
      displayCards.push(card);
      usedCardIds.add(card.id);
    }
  }

  return displayCards;
}

export function calculateStudyMetrics(
  allFlashcards: Flashcard[],
): StudyMetricsResult {
  const totalCardsInDeck = allFlashcards.length;
  const now = new Date();

  // Mastered: easyCount >= 5 AND easyCount >= 3 * hardCount
  const masteredCards = allFlashcards.filter(
    c => c.easyCount >= MASTERED_THRESHOLD && c.easyCount >= 3 * c.hardCount,
  );
  const masteredCardsCount = masteredCards.length;
  const masteredCardsPercentage =
    totalCardsInDeck === 0
      ? 0
      : Math.round((masteredCardsCount / totalCardsInDeck) * 100);

  const newCardsRemaining = allFlashcards.filter(c => c.isNew).length;

  const avgHardAttemptsPerMasteredCard =
    masteredCardsCount === 0
      ? 0
      : masteredCards.reduce((sum, c) => sum + c.hardCount, 0) /
        masteredCardsCount;

  const avgSeenCountPerMasteredCard =
    masteredCardsCount === 0
      ? 0
      : masteredCards.reduce((sum, c) => sum + c.seenCount, 0) /
        masteredCardsCount;

  // Re-hardened: hardCount > 0 AND easyCount > 0 AND hard/(hard+easy) > 0.3
  const reHardenedCardsCount = allFlashcards.filter(
    c =>
      c.hardCount > 0 &&
      c.easyCount > 0 &&
      c.hardCount / (c.hardCount + c.easyCount) > 0.3,
  ).length;

  // Average daily reviews
  let earliestDate = allFlashcards.reduce<Date | null>((earliest, c) => {
    if (!c.lastSeenDate) return earliest;
    const d = new Date(c.lastSeenDate);
    if (!earliest || d < earliest) return d;
    return earliest;
  }, null);
  if (!earliestDate) {
    // Fallback: use 7 days ago if no activity
    earliestDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  const daysActive = Math.max(
    1,
    Math.ceil((now.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const totalSeen = allFlashcards.reduce((sum, c) => sum + c.seenCount, 0);
  const averageDailyReviews = totalSeen / daysActive;

  // Current hard cards: hardCount > easyCount AND seenCount > 0
  const currentHardCardsCount = allFlashcards.filter(
    c => c.seenCount > 0 && c.hardCount > c.easyCount,
  ).length;

  return {
    totalCardsInDeck,
    masteredCardsCount,
    masteredCardsPercentage,
    newCardsRemaining,
    avgHardAttemptsPerMasteredCard,
    avgSeenCountPerMasteredCard,
    reHardenedCardsCount,
    averageDailyReviews,
    currentHardCardsCount,
  };
}
