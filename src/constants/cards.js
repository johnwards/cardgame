// Card type constants for the game

export const CARD_TYPES = {
  EXPLODING: 'exploding',
  DEFUSE: 'defuse',
  SKIP: 'skip',
  ATTACK: 'attack',
  SHUFFLE: 'shuffle',
  SEE_FUTURE: 'see_future',
  FAVOR: 'favor',
  NOPE: 'nope',
  CAT: 'cat'
};

export const CAT_TYPES = {
  TACO: 'taco_cat',
  RAINBOW: 'rainbow_cat',
  POTATO: 'potato_cat',
  BEARD: 'beard_cat',
  CATTERMELON: 'cattermelon'
};

// Initial deck composition
export const INITIAL_DECK = {
  [CARD_TYPES.EXPLODING]: 4, // Will be reduced based on player count
  [CARD_TYPES.DEFUSE]: 6,
  [CARD_TYPES.SKIP]: 4,
  [CARD_TYPES.ATTACK]: 4,
  [CARD_TYPES.SHUFFLE]: 4,
  [CARD_TYPES.SEE_FUTURE]: 5,
  [CARD_TYPES.FAVOR]: 4,
  [CARD_TYPES.NOPE]: 5,
  [CAT_TYPES.TACO]: 4,
  [CAT_TYPES.RAINBOW]: 4,
  [CAT_TYPES.POTATO]: 4,
  [CAT_TYPES.BEARD]: 4,
  [CAT_TYPES.CATTERMELON]: 4
};