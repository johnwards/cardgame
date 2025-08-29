/**
 * Phase 1: Core Game Foundation - Card System Implementation
 * 
 * This module implements the basic card system for Exploding Kittens Phase 1.
 * Phase 1 includes only the essential cards: Regular cards, Exploding Kittens, and Defuse cards.
 * Advanced action cards will be added in later phases.
 */

// Card type constants for Phase 1
export const CARD_TYPES = {
  EXPLODING: 'exploding',
  DEFUSE: 'defuse',
  REGULAR: 'regular'
};

// Phase 1 deck composition for 4 players
export const PHASE1_DECK_CONFIG = {
  // Core dangerous cards
  [CARD_TYPES.EXPLODING]: 3, // 4 players - 1 = 3 exploding kittens
  [CARD_TYPES.DEFUSE]: 6,    // Each player gets 1, remaining 2 go in deck
  [CARD_TYPES.REGULAR]: 47   // Regular safe cards for Phase 1
};

// Total cards calculation: 3 + 6 + 47 = 56 cards
// Initial deal: 4 players × 8 cards = 32 cards
// Remaining deck: 56 - 32 = 24 cards (includes 2 defuse + 3 exploding + 19 regular)

/**
 * Creates a card object with the specified properties
 * @param {string} type - Card type from CARD_TYPES
 * @param {string} name - Display name for the card
 * @param {string} emoji - Emoji representation
 * @param {string} description - Card description
 * @returns {Object} Card object with unique ID
 */
export function createCard(type, name, emoji, description = '') {
  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    name,
    emoji,
    description
  };
}

/**
 * Creates all Exploding Kitten cards for the game
 * @returns {Array} Array of Exploding Kitten card objects
 */
export function createExplodingKittens() {
  const cards = [];
  for (let i = 0; i < PHASE1_DECK_CONFIG[CARD_TYPES.EXPLODING]; i++) {
    cards.push(createCard(
      CARD_TYPES.EXPLODING,
      'Exploding Kitten',
      '💥🐱',
      'Explode unless you have a Defuse card'
    ));
  }
  return cards;
}

/**
 * Creates all Defuse cards for the game
 * @returns {Array} Array of Defuse card objects
 */
export function createDefuseCards() {
  const cards = [];
  for (let i = 0; i < PHASE1_DECK_CONFIG[CARD_TYPES.DEFUSE]; i++) {
    cards.push(createCard(
      CARD_TYPES.DEFUSE,
      'Defuse',
      '🛡️',
      'Defuse an Exploding Kitten'
    ));
  }
  return cards;
}

/**
 * Creates all Regular cards for the game
 * @returns {Array} Array of Regular card objects
 */
export function createRegularCards() {
  const cards = [];
  const regularCardTypes = [
    { name: 'Cat Card', emoji: '🐾' },
    { name: 'Kitten Card', emoji: '🐱' },
    { name: 'Safe Card', emoji: '✨' },
    { name: 'Happy Cat', emoji: '😸' },
    { name: 'Sleepy Cat', emoji: '😴' },
    { name: 'Cool Cat', emoji: '😎' },
    { name: 'Heart Cat', emoji: '💖' },
    { name: 'Star Card', emoji: '⭐' }
  ];

  for (let i = 0; i < PHASE1_DECK_CONFIG[CARD_TYPES.REGULAR]; i++) {
    const cardType = regularCardTypes[i % regularCardTypes.length];
    cards.push(createCard(
      CARD_TYPES.REGULAR,
      cardType.name,
      cardType.emoji,
      'Safe to play or keep'
    ));
  }
  return cards;
}

/**
 * Creates the complete initial deck for Phase 1
 * This includes all cards before dealing to players
 * @returns {Array} Array of all card objects for the game
 */
export function createInitialDeck() {
  const deck = [
    ...createExplodingKittens(),
    ...createDefuseCards(),
    ...createRegularCards()
  ];

  // Validate deck composition
  if (deck.length !== 56) {
    throw new Error(`Invalid deck size: expected 56 cards, got ${deck.length}`);
  }

  return deck;
}

/**
 * Shuffles a deck of cards using Fisher-Yates algorithm
 * This is a pure function - does not mutate the original array
 * @param {Array} deck - Array of card objects to shuffle
 * @param {Object} random - boardgame.io random object for deterministic shuffling
 * @returns {Array} New shuffled array of cards
 */
export function shuffleDeck(deck, random) {
  const shuffled = [...deck]; // Create a copy
  if (random && random.Shuffle) {
    // Use boardgame.io's deterministic shuffle
    return random.Shuffle(shuffled);
  } else {
    // Fallback to manual Fisher-Yates for testing
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

/**
 * Sets up the initial game deck according to Phase 1 rules
 * 1. Remove all Exploding Kittens and Defuse cards
 * 2. Deal cards to players (handled externally)
 * 3. Add remaining Defuse cards back to deck
 * 4. Add Exploding Kittens to deck
 * 5. Shuffle the final deck
 * 
 * @param {number} numPlayers - Number of players (should be 4 for Phase 1)
 * @param {Object} random - boardgame.io random object
 * @returns {Object} Object containing { dealtCards, finalDeck }
 */
export function setupGameDeck(numPlayers = 4, random) {
  if (numPlayers !== 4) {
    throw new Error('Phase 1 only supports exactly 4 players');
  }

  // Create initial deck
  const allCards = createInitialDeck();

  // Separate cards by type
  const explodingKittens = allCards.filter(card => card.type === CARD_TYPES.EXPLODING);
  const defuseCards = allCards.filter(card => card.type === CARD_TYPES.DEFUSE);
  const regularCards = allCards.filter(card => card.type === CARD_TYPES.REGULAR);

  // Prepare cards for dealing (exclude exploding kittens, include only needed defuse cards)
  const cardsForDealing = [
    ...defuseCards.slice(0, numPlayers), // 1 defuse per player
    ...regularCards
  ];

  // Shuffle cards for dealing
  const shuffledCardsForDealing = shuffleDeck(cardsForDealing, random);

  // Deal 8 cards per player (1 defuse + 7 others)
  const dealtCards = [];
  for (let player = 0; player < numPlayers; player++) {
    const playerCards = shuffledCardsForDealing.splice(0, 8);
    dealtCards.push(playerCards);
  }

  // Create final deck with remaining cards
  const remainingDefuseCards = defuseCards.slice(numPlayers); // Remaining 2 defuse cards
  const remainingRegularCards = shuffledCardsForDealing; // Leftover regular cards

  const finalDeckCards = [
    ...remainingDefuseCards,
    ...explodingKittens,
    ...remainingRegularCards
  ];

  // Shuffle the final deck
  const finalDeck = shuffleDeck(finalDeckCards, random);

  return {
    dealtCards,   // Array of arrays - each sub-array is one player's initial hand
    finalDeck     // Shuffled deck ready for drawing
  };
}

/**
 * Helper functions for card type checking
 */

/**
 * Checks if a card is an Exploding Kitten
 * @param {Object} card - Card object to check
 * @returns {boolean} True if card is an Exploding Kitten
 */
export function isExplodingKitten(card) {
  return card && card.type === CARD_TYPES.EXPLODING;
}

/**
 * Checks if a card is a Defuse card
 * @param {Object} card - Card object to check
 * @returns {boolean} True if card is a Defuse card
 */
export function isDefuseCard(card) {
  return card && card.type === CARD_TYPES.DEFUSE;
}

/**
 * Checks if a card is a Regular card
 * @param {Object} card - Card object to check
 * @returns {boolean} True if card is a Regular card
 */
export function isRegularCard(card) {
  return card && card.type === CARD_TYPES.REGULAR;
}

/**
 * Counts cards of a specific type in a hand
 * @param {Array} hand - Array of card objects
 * @param {string} cardType - Type of card to count
 * @returns {number} Number of cards of the specified type
 */
export function countCardType(hand, cardType) {
  return hand.filter(card => card.type === cardType).length;
}

/**
 * Finds the first card of a specific type in a hand
 * @param {Array} hand - Array of card objects
 * @param {string} cardType - Type of card to find
 * @returns {Object|null} First card of the specified type, or null if not found
 */
export function findCardOfType(hand, cardType) {
  return hand.find(card => card.type === cardType) || null;
}

/**
 * Validates that a deck has the correct Phase 1 composition
 * @param {Array} deck - Array of card objects to validate
 * @returns {boolean} True if deck composition is correct
 */
export function validateDeckComposition(deck) {
  const explodingCount = countCardType(deck, CARD_TYPES.EXPLODING);
  const defuseCount = countCardType(deck, CARD_TYPES.DEFUSE);
  const regularCount = countCardType(deck, CARD_TYPES.REGULAR);

  return explodingCount === PHASE1_DECK_CONFIG[CARD_TYPES.EXPLODING] &&
    defuseCount === PHASE1_DECK_CONFIG[CARD_TYPES.DEFUSE] &&
    regularCount === PHASE1_DECK_CONFIG[CARD_TYPES.REGULAR] &&
    deck.length === 56;
}