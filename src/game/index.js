/**
 * MINIMAL Exploding Kittens Game - Stripped down to basics for debugging
 * 
 * Following boardgame.io tutorial patterns exactly.
 * This is the simplest possible version to test drawCard functionality.
 */

import { INVALID_MOVE } from 'boardgame.io/core';

console.log('Game file loading...');

// Simple card creation for testing
function createCard(id, type, name) {
  return { id, type, name };
}

// Create minimal deck for testing
function createMinimalDeck() {
  const deck = [];

  // Add some regular cards
  for (let i = 0; i < 10; i++) {
    deck.push(createCard(`regular-${i}`, 'regular', `Regular Card ${i}`));
  }

  // Add defuse cards
  for (let i = 0; i < 3; i++) {
    deck.push(createCard(`defuse-${i}`, 'defuse', `Defuse Card ${i}`));
  }

  // Add exploding kittens
  for (let i = 0; i < 2; i++) {
    deck.push(createCard(`exploding-${i}`, 'exploding', `Exploding Kitten ${i}`));
  }

  console.log('Created deck with', deck.length, 'cards');
  return deck;
}

const ExplodingKittensGame = {
  name: 'exploding-kittens-minimal',

  setup: ({ ctx, random }) => {
    console.log('Setup called with numPlayers:', ctx.numPlayers);

    // Create minimal deck
    const fullDeck = createMinimalDeck();

    // Shuffle the deck
    random.Shuffle(fullDeck);

    // Create players
    const players = {};
    for (let i = 0; i < ctx.numPlayers; i++) {
      const playerHand = [];
      // Deal 5 cards to each player
      for (let j = 0; j < 5; j++) {
        if (fullDeck.length > 0) {
          playerHand.push(fullDeck.pop());
        }
      }

      players[i] = {
        id: i,
        name: i === 0 ? 'You' : `CPU ${i}`,
        hand: playerHand,
        isEliminated: false,
        isCPU: i !== 0
      };
    }

    const gameState = {
      players,
      deck: fullDeck,
      discardPile: []
    };

    console.log('Setup complete. Deck remaining:', fullDeck.length);

    return gameState;
  },

  moves: {
    drawCard: ({ G, playerID }) => {
      console.log('=== DRAWCARD MOVE CALLED ===');
      console.log('playerID:', playerID);

      if (G.deck.length === 0) {
        console.log('Deck empty, invalid move');
        return INVALID_MOVE;
      }

      const card = G.deck.pop();
      G.players[playerID].hand.push(card);

      console.log('Drew card:', card.name);
      console.log('=== DRAWCARD COMPLETE ===');
    }
  },

  turn: {
    minMoves: 1,
    maxMoves: 1
  }
};

console.log('Game definition created');

export default ExplodingKittensGame;
