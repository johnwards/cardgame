/**
 * Card system implementation for Exploding Kittens
 * Defines card types, creation functions, and deck setup
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

export const PHASE1_DECK_CONFIG = {
  [CARD_TYPES.EXPLODING]: 3,
  [CARD_TYPES.DEFUSE]: 6,
  [CARD_TYPES.SKIP]: 4,
  [CARD_TYPES.FAVOR]: 4,
  [CARD_TYPES.SHUFFLE]: 4,
  [CARD_TYPES.ATTACK]: 4,
  [CARD_TYPES.SEE_FUTURE]: 5,
  [CARD_TYPES.CAT]: 20
};

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
 * Creates all Exploding Kitten cards
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
 * Creates all Defuse cards
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

export function createCatCards() {
  const cards = [];
  const catTypes = [
    { name: 'Tacocat', emoji: '🌮🐱' },
    { name: 'Rainbow-ralphing Cat', emoji: '🌈🐱' },
    { name: 'Potato Cat', emoji: '🥔🐱' },
    { name: 'Beard Cat', emoji: '🧔🐱' },
    { name: 'Cattermelon', emoji: '🍉🐱' }
  ];

  for (let typeIndex = 0; typeIndex < catTypes.length; typeIndex++) {
    const catType = catTypes[typeIndex];
    for (let i = 0; i < 4; i++) {
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
 * Creates the complete initial deck
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
 * Shuffles a deck using boardgame.io's deterministic shuffle
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

export function isExplodingKitten(card) {
  return card && card.type === CARD_TYPES.EXPLODING;
}

export function isDefuseCard(card) {
  return card && card.type === CARD_TYPES.DEFUSE;
}



export function countCardType(hand, cardType) {
  return hand.filter(card => card.type === cardType).length;
}

export function findCardOfType(hand, cardType) {
  return hand.find(card => card.type === cardType) || null;
}

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

export function findCatPairs(hand) {
  const groups = groupCatCards(hand);
  const pairs = [];

  Object.values(groups).forEach(group => {
    if (group.length >= 2) {
      pairs.push(group.slice(0, 2));
    }
  });

  return pairs;
}

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