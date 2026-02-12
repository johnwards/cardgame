/**
 * cards.js - Card definitions and deck management for Exploding Kittens
 *
 * This module defines every type of card in the game, and provides
 * functions to create individual cards, build a full deck, and shuffle it.
 *
 * We use ES6 modules (export) so other files can import only what they need.
 */

// ---------------------------------------------------------------------------
// Card type definitions
// ---------------------------------------------------------------------------
// Each type has a name, emoji, description, and how many are in the deck.
// We freeze the object so it can't be accidentally modified at runtime -
// card types are constants that should never change during a game.

const CARD_TYPES = {
  exploding:   { name: 'Exploding Kitten',  emoji: '💥🐱', description: 'Explode unless you have a Defuse card',   count: 3  },
  defuse:      { name: 'Defuse',            emoji: '🛡️',  description: 'Defuse an Exploding Kitten',              count: 6  },
  skip:        { name: 'Skip',              emoji: '⏭️',  description: 'End your turn without drawing',           count: 4  },
  favor:       { name: 'Favor',             emoji: '🤝',  description: 'Force a player to give you a card',       count: 4  },
  shuffle:     { name: 'Shuffle',           emoji: '🔀',  description: 'Shuffle the draw pile',                   count: 4  },
  attack:      { name: 'Attack',            emoji: '⚔️',  description: 'End turn, next player takes 2 turns',     count: 4  },
  see_future:  { name: 'See the Future',    emoji: '🔮',  description: 'Peek at top 3 cards of the deck',         count: 5  },
  cat:         { name: 'Cat Card',          emoji: '🐱',  description: 'Collect pairs to steal cards',            count: 20 }
};

// The five different cat card varieties - 4 of each in the deck (5 x 4 = 20)
const CAT_TYPES = [
  { name: 'Tacocat',              emoji: '🌮🐱' },
  { name: 'Rainbow-ralphing Cat', emoji: '🌈🐱' },
  { name: 'Potato Cat',           emoji: '🥔🐱' },
  { name: 'Beard Cat',            emoji: '🧔🐱' },
  { name: 'Cattermelon',          emoji: '🍉🐱' }
];

// ---------------------------------------------------------------------------
// createCard(type, catName) - build a single card object
// ---------------------------------------------------------------------------
// Every card in the game needs a unique ID so we can track and reference it.
// We combine Date.now() (milliseconds since 1970) with a random string to
// make collisions practically impossible.

function createCard(type, catName = null) {
  const id = `card-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  // Look up the base definition for this card type
  const base = CARD_TYPES[type];

  // For cat cards we override the generic name/emoji with the specific variety
  if (type === 'cat' && catName) {
    const catType = CAT_TYPES.find(c => c.name === catName);
    return {
      id,
      type,
      name: catType.name,
      emoji: catType.emoji,
      description: base.description
    };
  }

  // For all other card types, use the values straight from CARD_TYPES
  return {
    id,
    type,
    name: base.name,
    emoji: base.emoji,
    description: base.description
  };
}

// ---------------------------------------------------------------------------
// createDeck() - build the full 50-card deck (unsorted)
// ---------------------------------------------------------------------------
// The deck composition matches the real Exploding Kittens game:
//   - 3 Exploding Kittens
//   - 6 Defuse cards
//   - 4 each of Skip, Favor, Shuffle, Attack
//   - 5 See the Future
//   - 20 Cat cards (4 copies of each of the 5 cat varieties)
// Total: 3 + 6 + 4 + 4 + 4 + 4 + 5 + 20 = 50 cards

function createDeck() {
  const deck = [];

  for (const [type, info] of Object.entries(CARD_TYPES)) {
    if (type === 'cat') {
      // Cat cards are special - we create 4 of each variety
      for (const catType of CAT_TYPES) {
        for (let i = 0; i < 4; i++) {
          deck.push(createCard('cat', catType.name));
        }
      }
    } else {
      // For every other type, create the number specified by count
      for (let i = 0; i < info.count; i++) {
        deck.push(createCard(type));
      }
    }
  }

  return deck;
}

// ---------------------------------------------------------------------------
// shuffleDeck(deck) - Fisher-Yates shuffle
// ---------------------------------------------------------------------------
// Why Fisher-Yates? A naive shuffle (e.g. sorting with Math.random) produces
// biased results - some orderings are more likely than others. Fisher-Yates
// guarantees every possible permutation is equally probable, which is exactly
// what we want for a fair card game.
//
// How it works:
//   1. Start at the last element of the array.
//   2. Pick a random element from index 0 up to (and including) the current index.
//   3. Swap the current element with the randomly chosen one.
//   4. Move one position towards the front and repeat.
//
// After one pass through the array, every card has had an equal chance of
// ending up in every position. The algorithm runs in O(n) time.

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at positions i and j using destructuring assignment
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Return the same array for convenience (it was already mutated in place)
  return deck;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { CARD_TYPES, CAT_TYPES, createCard, createDeck, shuffleDeck };
