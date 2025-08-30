/**
 * Exploding Kittens Game - Phase A Implementation
 * 
 * Following boardgame.io tutorial patterns exactly.
 * Phase A.1: Expanded to 4-player game structure (1 human + 3 CPU)
 * Phase A.2: Implemented proper card system with correct deck composition
 */

import { INVALID_MOVE } from 'boardgame.io/core';
import { setupGameDeck, CARD_TYPES } from '../constants/cards.js';

console.log('Game file loading...');

const ExplodingKittensGame = {
  name: 'exploding-kittens-phase-a',

  setup: ({ ctx, random }) => {
    console.log('Phase A Setup called with numPlayers:', ctx.numPlayers);

    // Force 4 players for Phase A (1 human + 3 CPU)
    const numPlayers = 4;

    // Use proper card system from constants
    const { dealtCards, finalDeck } = setupGameDeck(numPlayers, random);

    // Create 4 players (Player 0 = human, Players 1-3 = CPU)
    const players = {};
    for (let i = 0; i < numPlayers; i++) {
      players[i] = {
        id: i,
        name: i === 0 ? 'You' : `CPU ${i}`,
        hand: dealtCards[i], // Each player gets their dealt cards (1 defuse + 7 regular)
        isEliminated: false,
        isCPU: i !== 0
      };
    }

    const gameState = {
      players,
      deck: finalDeck, // Remaining deck with 2 defuse + 3 exploding + 19 regular
      discardPile: []
    };

    console.log('Phase A Setup complete:');
    console.log('- Players:', numPlayers);
    console.log('- Deck remaining:', finalDeck.length);
    console.log('- Each player starts with 8 cards (1 defuse + 7 regular)');

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
