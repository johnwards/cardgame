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
  SKIP: 'skip',
  FAVOR: 'favor',
  SHUFFLE: 'shuffle',
  ATTACK: 'attack',
  SEE_FUTURE: 'see_future',
  CAT: 'cat'
};

// Phase 1 deck composition for 4 players
export const PHASE1_DECK_CONFIG = {
  // Core dangerous cards - TEMPORARILY INCREASED FOR TESTING
  [CARD_TYPES.EXPLODING]: 8, // Increased from 3 to 8 for easier testing
  [CARD_TYPES.DEFUSE]: 8,    // Increased from 6 to 8 for testing
  // Action cards
  [CARD_TYPES.SKIP]: 4,
  [CARD_TYPES.FAVOR]: 4,
  [CARD_TYPES.SHUFFLE]: 4,
  [CARD_TYPES.ATTACK]: 4,
  [CARD_TYPES.SEE_FUTURE]: 4,
  [CARD_TYPES.CAT]: 12       // 3 different types, 4 of each
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
 * Creates all Skip cards for the game
 * @returns {Array} Array of Skip card objects
 */
export function createSkipCards() {
  const cards = [];
  for (let i = 0; i < PHASE1_DECK_CONFIG[CARD_TYPES.SKIP]; i++) {
    cards.push(createCard(
      CARD_TYPES.SKIP,
      'Skip',
      '⏭️',
      'End your turn without drawing a card'
    ));
  }
  return cards;
}

/**
 * Creates all Favor cards for the game
 * @returns {Array} Array of Favor card objects
 */
export function createFavorCards() {
  const cards = [];
  for (let i = 0; i < PHASE1_DECK_CONFIG[CARD_TYPES.FAVOR]; i++) {
    cards.push(createCard(
      CARD_TYPES.FAVOR,
      'Favor',
      '🤝',
      'Force another player to give you a card'
    ));
  }
  return cards;
}

/**
 * Creates all Shuffle cards for the game
 * @returns {Array} Array of Shuffle card objects
 */
export function createShuffleCards() {
  const cards = [];
  for (let i = 0; i < PHASE1_DECK_CONFIG[CARD_TYPES.SHUFFLE]; i++) {
    cards.push(createCard(
      CARD_TYPES.SHUFFLE,
      'Shuffle',
      '🔀',
      'Shuffle the deck'
    ));
  }
  return cards;
}

/**
 * Creates all Attack cards for the game
 * @returns {Array} Array of Attack card objects
 */
export function createAttackCards() {
  const cards = [];
  for (let i = 0; i < PHASE1_DECK_CONFIG[CARD_TYPES.ATTACK]; i++) {
    cards.push(createCard(
      CARD_TYPES.ATTACK,
      'Attack',
      '⚔️',
      'End your turn and force the next player to take 2 turns'
    ));
  }
  return cards;
}

/**
 * Creates all See the Future cards for the game
 * @returns {Array} Array of See the Future card objects
 */
export function createSeeTheFutureCards() {
  const cards = [];
  for (let i = 0; i < PHASE1_DECK_CONFIG[CARD_TYPES.SEE_FUTURE]; i++) {
    cards.push(createCard(
      CARD_TYPES.SEE_FUTURE,
      'See the Future',
      '🔮',
      'Secretly view the top 3 cards of the deck'
    ));
  }
  return cards;
}

/**
 * Creates all Cat cards for the game
 * @returns {Array} Array of Cat card objects
 */
export function createCatCards() {
  const cards = [];
  const catTypes = [
    { name: 'Tacocat', emoji: '🌮🐱' },
    { name: 'Rainbow Cat', emoji: '🌈🐱' },
    { name: 'Potato Cat', emoji: '🥔🐱' }
  ];

  for (let typeIndex = 0; typeIndex < catTypes.length; typeIndex++) {
    const catType = catTypes[typeIndex];
    for (let i = 0; i < 4; i++) { // 4 of each cat type
      cards.push(createCard(
        CARD_TYPES.CAT,
        catType.name,
        catType.emoji,
        'Play 2 matching cats to steal a random card'
      ));
    }
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
    ...createSkipCards(),
    ...createFavorCards(),
    ...createShuffleCards(),
    ...createAttackCards(),
    ...createSeeTheFutureCards(),
    ...createCatCards()
  ];

  // Calculate expected deck size
  const expectedSize = Object.values(PHASE1_DECK_CONFIG).reduce((sum, count) => sum + count, 0);

  // Validate deck composition
  if (deck.length !== expectedSize) {
    throw new Error(`Invalid deck size: expected ${expectedSize} cards, got ${deck.length}`);
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
  const actionCards = allCards.filter(card =>
    card.type === CARD_TYPES.SKIP ||
    card.type === CARD_TYPES.FAVOR ||
    card.type === CARD_TYPES.SHUFFLE ||
    card.type === CARD_TYPES.ATTACK ||
    card.type === CARD_TYPES.SEE_FUTURE ||
    card.type === CARD_TYPES.CAT
  );

  // Shuffle action cards for dealing
  const shuffledActionCards = shuffleDeck(actionCards, random);

  // Deal cards to players: each gets exactly 1 defuse + 7 action cards
  const dealtCards = [];
  for (let player = 0; player < numPlayers; player++) {
    const playerCards = [
      defuseCards[player], // Each player gets exactly 1 defuse card
      ...shuffledActionCards.splice(0, 7) // Plus 7 action cards
    ];
    dealtCards.push(playerCards);
  }

  // Create final deck with remaining cards
  const remainingDefuseCards = defuseCards.slice(numPlayers); // Remaining 4 defuse cards
  const remainingActionCards = shuffledActionCards; // Leftover action cards after dealing

  const finalDeckCards = [
    ...remainingDefuseCards,
    ...explodingKittens,
    ...remainingActionCards
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
 * Groups cat cards by name in a hand
 * @param {Array} hand - Array of card objects
 * @returns {Object} Object with cat names as keys and arrays of matching cards as values
 */
export function groupCatCards(hand) {
  const catCards = hand.filter(card => card.type === CARD_TYPES.CAT);
  const groups = {};

  catCards.forEach(card => {
    if (!groups[card.name]) {
      groups[card.name] = [];
    }
    groups[card.name].push(card);
  });

  return groups;
}

/**
 * Finds matching cat card pairs in a hand
 * @param {Array} hand - Array of card objects
 * @returns {Array} Array of arrays, each containing matching cat cards
 */
export function findCatPairs(hand) {
  const groups = groupCatCards(hand);
  const pairs = [];

  Object.values(groups).forEach(group => {
    if (group.length >= 2) {
      pairs.push(group.slice(0, 2)); // Take first 2 cards of this type
    }
  });

  return pairs;
}

/**
 * Validates that a deck has the correct Phase 1 composition
 * @param {Array} deck - Array of card objects to validate
 * @returns {boolean} True if deck composition is correct
 */
export function validateDeckComposition(deck) {
  const expectedSize = Object.values(PHASE1_DECK_CONFIG).reduce((sum, count) => sum + count, 0);

  const explodingCount = countCardType(deck, CARD_TYPES.EXPLODING);
  const defuseCount = countCardType(deck, CARD_TYPES.DEFUSE);
  const skipCount = countCardType(deck, CARD_TYPES.SKIP);
  const favorCount = countCardType(deck, CARD_TYPES.FAVOR);
  const shuffleCount = countCardType(deck, CARD_TYPES.SHUFFLE);
  const attackCount = countCardType(deck, CARD_TYPES.ATTACK);
  const catCount = countCardType(deck, CARD_TYPES.CAT);

  return explodingCount === PHASE1_DECK_CONFIG[CARD_TYPES.EXPLODING] &&
    defuseCount === PHASE1_DECK_CONFIG[CARD_TYPES.DEFUSE] &&
    skipCount === PHASE1_DECK_CONFIG[CARD_TYPES.SKIP] &&
    favorCount === PHASE1_DECK_CONFIG[CARD_TYPES.FAVOR] &&
    shuffleCount === PHASE1_DECK_CONFIG[CARD_TYPES.SHUFFLE] &&
    attackCount === PHASE1_DECK_CONFIG[CARD_TYPES.ATTACK] &&
    catCount === PHASE1_DECK_CONFIG[CARD_TYPES.CAT] &&
    deck.length === expectedSize;
}