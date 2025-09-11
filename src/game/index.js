/**
 * Exploding Kittens Game - Phase C Implementation
 * 
 * Following boardgame.io tutorial patterns exactly.
 * Phase A.1: Expanded to 4-player game structure (1 human + 3 CPU) ✅
 * Phase A.2: Implemented proper card system with correct deck composition ✅
 * Phase B.1: Added basic card playing move (playCard) ✅
 * Phase B.2: Implemented exploding kitten detection and defuse mechanics ✅
 * Phase C.1: Added win condition logic (endIf) ✅
 * Phase C.2: Implemented basic CPU AI logic (ai.enumerate) ✅
 */

import { INVALID_MOVE } from 'boardgame.io/core';
import { setupGameDeck, CARD_TYPES } from '../constants/cards.js';

console.log('Game file loading...');

const ExplodingKittensGame = {
  name: 'exploding-kittens-phase-c',

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
      discardPile: [],
      pendingExplodingKitten: null, // For defused exploding kittens awaiting placement
      pendingPlayer: null // Player who needs to place the exploding kitten
    };

    console.log('Phase C Setup complete:');
    console.log('- Players:', numPlayers);
    console.log('- Deck remaining:', finalDeck.length);
    console.log('- Each player starts with 8 cards (1 defuse + 7 regular)');
    console.log('- Phase C features: CPU AI logic, complete win conditions, automatic CPU turns');

    return gameState;
  },

  moves: {
    playCard: ({ G, playerID }, cardIndex) => {
      console.log('=== PLAYCARD MOVE CALLED ===');
      console.log('playerID:', playerID, 'cardIndex:', cardIndex);

      // Validate card index
      if (cardIndex < 0 || cardIndex >= G.players[playerID].hand.length) {
        console.log('Invalid card index');
        return INVALID_MOVE;
      }

      const card = G.players[playerID].hand[cardIndex];
      console.log('Attempting to play card:', card.name, 'type:', card.type);

      // Only allow regular cards for Phase B.1
      if (card.type !== CARD_TYPES.REGULAR) {
        console.log('Cannot play non-regular card in Phase B.1');
        return INVALID_MOVE;
      }

      // Move card from hand to discard pile
      G.players[playerID].hand.splice(cardIndex, 1);
      G.discardPile.push(card);

      console.log('Card played successfully, discard pile now has', G.discardPile.length, 'cards');
      console.log('=== PLAYCARD COMPLETE ===');

      // Don't end turn - allow multiple card plays
    },

    drawCard: ({ G, playerID, events }) => {
      console.log('=== DRAWCARD MOVE CALLED ===');
      console.log('playerID:', playerID);

      if (G.deck.length === 0) {
        console.log('Deck empty, invalid move');
        return INVALID_MOVE;
      }

      const card = G.deck.pop();
      console.log('Drew card:', card.name, 'type:', card.type);

      // Check if it's an exploding kitten
      if (card.type === CARD_TYPES.EXPLODING) {
        console.log('EXPLODING KITTEN DRAWN!');

        // Check for defuse card
        const defuseIndex = G.players[playerID].hand.findIndex(
          c => c.type === CARD_TYPES.DEFUSE
        );

        if (defuseIndex !== -1) {
          console.log('🛡️ Player has defuse card at index:', defuseIndex);
          console.log('🛡️ Defuse card details:', G.players[playerID].hand[defuseIndex]);
          console.log('🛡️ Player hand before defuse:', G.players[playerID].hand.length, 'cards');
          console.log('🛡️ Discard pile before defuse:', G.discardPile.length, 'cards');

          // Player has defuse - remove it and discard it
          const defuseCard = G.players[playerID].hand.splice(defuseIndex, 1)[0];
          G.discardPile.push(defuseCard);

          console.log('🛡️ DEFUSE CARD CONSUMED!');
          console.log('🛡️ Player hand after defuse:', G.players[playerID].hand.length, 'cards');
          console.log('🛡️ Discard pile after defuse:', G.discardPile.length, 'cards');
          console.log('🛡️ Defused card moved to discard:', defuseCard.name);

          // Set state for exploding kitten placement
          G.pendingExplodingKitten = card;
          G.pendingPlayer = playerID;

          console.log('🛡️ Defuse used, awaiting exploding kitten placement');

          // Don't end turn - wait for placement
          return;
        } else {
          console.log('💀 Player has no defuse card - ELIMINATED!');
          console.log('💀 Player', playerID, 'hand contents:', G.players[playerID].hand.map(c => c.type));
          console.log('💀 Player elimination status before:', G.players[playerID].isEliminated);

          // Player has no defuse - eliminate them
          G.players[playerID].isEliminated = true;

          console.log('💀 PLAYER ELIMINATED!');
          console.log('💀 Player', playerID, 'elimination status after:', G.players[playerID].isEliminated);
          console.log('💀 Player name:', G.players[playerID].name);

          // Don't add exploding kitten to hand - it exploded!

          // Check win condition
          const alivePlayers = Object.values(G.players).filter(p => !p.isEliminated);
          console.log('💀 Players remaining alive:', alivePlayers.length);
          console.log('💀 Alive players:', alivePlayers.map(p => p.name));

          if (alivePlayers.length === 1) {
            console.log('Game over - single winner!');
            // Game will end via endIf condition
          }

          // End turn after elimination
          console.log('Ending turn after player elimination');
          events.endTurn();
          return;
        }
      } else {
        // Regular card - add to hand
        G.players[playerID].hand.push(card);
        console.log('Regular card added to hand');
      }

      console.log('Drawing card ends turn - passing to next player');
      events.endTurn();
      console.log('=== DRAWCARD COMPLETE ===');
    },

    placeExplodingKitten: ({ G, playerID, events }, position) => {
      console.log('=== PLACE EXPLODING KITTEN MOVE CALLED ===');
      console.log('playerID:', playerID, 'position:', position);
      console.log('💣 Deck length before placement:', G.deck.length);
      console.log('💣 Deck top 3 cards before placement:', G.deck.slice(-3).map(c => c.name));

      if (!G.pendingExplodingKitten || G.pendingPlayer !== playerID) {
        console.log('No pending exploding kitten or wrong player');
        return INVALID_MOVE;
      }

      // Validate position (0 = top of deck, deck.length = bottom of deck)
      if (position < 0 || position > G.deck.length) {
        console.log('Invalid position:', position, 'deck length:', G.deck.length);
        return INVALID_MOVE;
      }

      // Calculate actual array position
      // Since deck.pop() takes from END of array, position 0 should be END of array
      let actualPosition;
      if (position === 0) {
        // Top of deck = end of array (next card to be drawn)
        actualPosition = G.deck.length;
      } else if (position === G.deck.length) {
        // Bottom of deck = beginning of array (last card to be drawn)
        actualPosition = 0;
      } else {
        // Middle positions need to be flipped
        actualPosition = G.deck.length - position;
      }

      console.log('💣 Requested position:', position, '(0=top, ' + G.deck.length + '=bottom)');
      console.log('💣 Actual array position:', actualPosition);

      // Insert at calculated position
      G.deck.splice(actualPosition, 0, G.pendingExplodingKitten);

      console.log('💣 EXPLODING KITTEN PLACED!');
      console.log('💣 Deck length after placement:', G.deck.length);
      console.log('💣 Deck top 3 cards after placement:', G.deck.slice(-3).map(c => c.name));
      console.log('💣 Card placed:', G.pendingExplodingKitten.name);

      // Clear pending state
      G.pendingExplodingKitten = null;
      G.pendingPlayer = null;

      console.log('Exploding kitten placement ends turn - passing to next player');
      events.endTurn();
      console.log('=== PLACE EXPLODING KITTEN COMPLETE ===');
    }
  },

  turn: {
    // No minMoves or maxMoves - turns end explicitly via events.endTurn()
    // Players can play multiple cards, but drawing always ends the turn

    onBegin: ({ G, ctx, events }) => {
      // Skip eliminated players
      let currentPlayer = parseInt(ctx.currentPlayer);
      if (G.players[currentPlayer]?.isEliminated) {
        console.log('Skipping eliminated player:', currentPlayer);
        events.endTurn();
      }
    }
  },

  endIf: ({ G }) => {
    const alivePlayers = Object.values(G.players).filter(p => !p.isEliminated);

    if (alivePlayers.length === 1) {
      console.log('Game over - single winner:', alivePlayers[0].name);
      return {
        winner: alivePlayers[0].id,
        winnerName: alivePlayers[0].name,
        reason: "Last player standing"
      };
    }

    if (G.deck.length === 0) {
      console.log('Game over - deck exhausted');
      return {
        winner: alivePlayers.map(p => p.id),
        winnerName: "All remaining players",
        reason: "Deck exhausted"
      };
    }

    return false;
  },

  // Phase C.2: Basic CPU AI Logic
  ai: {
    enumerate: (G, ctx) => {
      console.log('=== AI ENUMERATE CALLED ===');
      const playerID = ctx.currentPlayer;

      const moves = [];
      console.log('CPU player', playerID, 'is active, generating moves...');
      // Handle pending exploding kitten placement first
      if (G.pendingExplodingKitten && G.pendingPlayer === playerID) {
        console.log('CPU needs to place exploding kitten');

        const deckLength = G.deck.length;
        moves.push({ move: 'placeExplodingKitten', args: [0] });
        moves.push({ move: 'placeExplodingKitten', args: [Math.floor(deckLength / 3)] });
        moves.push({ move: 'placeExplodingKitten', args: [Math.floor(deckLength * 2 / 3)] });
        moves.push({ move: 'placeExplodingKitten', args: [deckLength] });
        return moves;
      }

      const player = G.players[playerID];
      console.log('CPU player', playerID, 'hand size:', player.hand.length);

      const regularCards = player.hand.filter(card => card.type === CARD_TYPES.REGULAR);
      const defuseCards = player.hand.filter(card => card.type === CARD_TYPES.DEFUSE);

      console.log('CPU', playerID, 'has', regularCards.length, 'regular cards and', defuseCards.length, 'defuse cards');

      for (let i = 0; i++; i < regularCards.length) {
        moves.push({ move: 'playCard', args: [i] });
      }
      moves.push({ move: 'drawCard', args: [] });

      return moves;
    }
  }
};

console.log('Game definition created');

export default ExplodingKittensGame;
