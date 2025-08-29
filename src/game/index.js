/**
 * Phase 1: Core Game Foundation - boardgame.io Game Definition
 * 
 * This module implements the core boardgame.io game definition for Exploding Kittens Phase 1.
 * Phase 1 includes the essential gameplay loop with Regular cards, Exploding Kittens, and Defuse cards.
 * 
 * Game supports exactly 4 players: 1 human player and 3 CPU players.
 */

import { INVALID_MOVE, TurnOrder, PlayerView } from 'boardgame.io/core';
import { setupGameDeck, CARD_TYPES, isExplodingKitten, isDefuseCard, findCardOfType } from '../constants/cards.js';

/**
 * Creates a player object with initial state
 * @param {string} id - Unique player identifier
 * @param {string} name - Display name for player
 * @param {boolean} isCPU - Whether this is a CPU-controlled player
 * @param {Array} initialHand - Initial cards dealt to player
 * @returns {Object} Player object with required fields
 */
function createPlayer(id, name, isCPU, initialHand = []) {
  return {
    id,
    name,
    hand: initialHand,
    isEliminated: false,
    isCPU,
    handSize: initialHand.length
  };
}

/**
 * Gets all players who are still alive (not eliminated)
 * @param {Object} G - Game state object
 * @returns {Array} Array of alive player objects
 */
function getAlivePlayers(G) {
  return Object.values(G.players).filter(player => !player.isEliminated);
}

/**
 * Checks if a player has a defuse card in their hand
 * @param {Object} player - Player object to check
 * @returns {boolean} True if player has at least one defuse card
 */
function hasDefuseCard(player) {
  return findCardOfType(player.hand, CARD_TYPES.DEFUSE) !== null;
}

/**
 * Removes the first defuse card from a player's hand
 * @param {Object} player - Player object to modify
 * @returns {Object|null} The removed defuse card, or null if none found
 */
function removeDefuseCard(player) {
  const defuseIndex = player.hand.findIndex(card => isDefuseCard(card));
  if (defuseIndex === -1) return null;

  const defuseCard = player.hand.splice(defuseIndex, 1)[0];
  player.handSize = player.hand.length;
  return defuseCard;
}

/**
 * Main game definition for Exploding Kittens Phase 1
 */
const ExplodingKittensGame = {
  name: 'exploding-kittens-phase1',

  /**
   * Game setup function - initializes game state for 4 players
   * @param {Object} setupCtx - Setup context with numPlayers and random
   * @returns {Object} Initial game state (G)
   */
  setup: ({ ctx, random }) => {
    // Ensure exactly 4 players for Phase 1
    if (ctx.numPlayers !== 4) {
      throw new Error('Phase 1 only supports exactly 4 players');
    }

    // Setup deck and deal initial cards
    const { dealtCards, finalDeck } = setupGameDeck(ctx.numPlayers, random);

    // Create players with dealt cards
    const players = {};
    const playerNames = ['You', 'CPU 1', 'CPU 2', 'CPU 3'];

    for (let i = 0; i < ctx.numPlayers; i++) {
      const playerId = i.toString();
      const playerName = playerNames[i];
      const isCPU = i > 0; // First player (index 0) is human, rest are CPU
      const initialHand = dealtCards[i];

      players[playerId] = createPlayer(playerId, playerName, isCPU, initialHand);
    }

    // Initialize game state
    const gameState = {
      // Main game data
      deck: finalDeck,
      players,
      discardPile: [],

      // Secret state for information hiding
      secret: {
        deckOrder: [...finalDeck], // Original deck order for deterministic play
        explodingKittenPositions: [] // Track positions where exploding kittens were placed
      },

      // Game metadata
      gamePhase: 'playing',
      totalTurns: 0,
      lastAction: null
    };

    return gameState;
  },

  /**
   * Move definitions - currently placeholders for future implementation
   */
  moves: {
    /**
     * Play a card from player's hand to discard pile
     * @param {Object} G - Game state
     * @param {Object} ctx - Game context
     * @param {string} playerID - ID of player making the move
     * @param {Object} events - Game events for turn management
     * @param {number} cardIndex - Index of card in player's hand to play
     */
    playCard: ({ G, playerID }, cardIndex) => {
      // Validation - return INVALID_MOVE for invalid actions
      const player = G.players[playerID];
      if (!player || player.isEliminated) {
        return INVALID_MOVE;
      }

      if (cardIndex < 0 || cardIndex >= player.hand.length) {
        return INVALID_MOVE;
      }

      // For Phase 1, playing cards just moves them to discard pile
      // Move logic implementation will be added in Phase 2
      const card = player.hand.splice(cardIndex, 1)[0];
      G.discardPile.push(card);
      player.handSize = player.hand.length;

      // Update game metadata
      G.lastAction = `${player.name} played ${card.name}`;

      // Note: Playing cards does NOT end turn in Exploding Kittens
      // Players must explicitly draw or use a turn-ending action
    },

    /**
     * Draw a card from the deck
     * @param {Object} G - Game state
     * @param {Object} ctx - Game context
     * @param {string} playerID - ID of player making the move
     * @param {Object} events - Game events for turn management
     */
    drawCard: ({ G, playerID, events }) => {
      // Validation
      const player = G.players[playerID];
      if (!player || player.isEliminated) {
        return INVALID_MOVE;
      }

      if (G.deck.length === 0) {
        return INVALID_MOVE;
      }

      // Draw card from top of deck
      const drawnCard = G.deck.pop();
      player.hand.push(drawnCard);
      player.handSize = player.hand.length;

      // Update game metadata
      G.lastAction = `${player.name} drew a card`;

      // Check if drawn card is an Exploding Kitten
      if (isExplodingKitten(drawnCard)) {
        if (hasDefuseCard(player)) {
          // Player has defuse card - they survive but must place the kitten back
          const defuseCard = removeDefuseCard(player);
          G.discardPile.push(defuseCard);

          // Remove exploding kitten from hand temporarily
          const kittenIndex = player.hand.findIndex(card => isExplodingKitten(card));
          const explodingKitten = player.hand.splice(kittenIndex, 1)[0];
          player.handSize = player.hand.length;

          // Store the exploding kitten for placement - awaiting player choice
          G.secret.pendingExplodingKitten = explodingKitten;
          G.lastAction = `${player.name} defused an Exploding Kitten!`;

          // For CPU players: auto-place and end turn
          // For human players: keep turn active until they place the kitten
          if (player.isCPU) {
            // CPU auto-places randomly and ends turn
            const randomPosition = Math.floor(Math.random() * (G.deck.length + 1));
            G.deck.splice(randomPosition, 0, explodingKitten);
            G.secret.explodingKittenPositions.push(randomPosition);
            delete G.secret.pendingExplodingKitten;
            events.endTurn();
          }
          // Human players: turn continues, they must use placeExplodingKitten move
        } else {
          // Player has no defuse card - they are eliminated
          player.isEliminated = true;
          G.lastAction = `${player.name} exploded and was eliminated!`;
          events.endTurn();
        }
      } else {
        // Normal card drawn - turn ends
        events.endTurn();
      }
    },

    /**
     * Place an exploding kitten back into the deck at specified position
     * @param {Object} G - Game state
     * @param {Object} ctx - Game context
     * @param {string} playerID - ID of player making the move
     * @param {Object} events - Game events for turn management
     * @param {number} position - Position in deck to place the kitten (0 = top)
     */
    placeExplodingKitten: ({ G, playerID, events }, position) => {
      // This move will be fully implemented in Phase 2
      // For now, it's a placeholder for the exploding kitten placement interface

      if (!G.secret.pendingExplodingKitten) {
        return INVALID_MOVE;
      }

      const explodingKitten = G.secret.pendingExplodingKitten;
      delete G.secret.pendingExplodingKitten;

      // Validate position
      const maxPosition = G.deck.length;
      const finalPosition = Math.max(0, Math.min(position, maxPosition));

      // Place kitten in deck
      G.deck.splice(finalPosition, 0, explodingKitten);
      G.secret.explodingKittenPositions.push(finalPosition);

      const player = G.players[playerID];
      G.lastAction = `${player.name} placed the Exploding Kitten back in the deck`;

      // End turn after placing kitten
      events.endTurn();
    }
  },

  /**
   * Turn configuration
   */
  turn: {
    order: TurnOrder.DEFAULT,

    /**
     * Turn begin handler - skip eliminated players
     */
    onBegin: ({ G, ctx, events }) => {
      const currentPlayer = G.players[ctx.currentPlayer];
      if (currentPlayer && currentPlayer.isEliminated) {
        // Skip eliminated players automatically
        events.endTurn();
      }

      G.totalTurns++;
    },

    /**
     * Turn end handler - cleanup only
     */
    onEnd: () => {
      // No auto-placement needed here anymore
      // CPU placement is handled directly in drawCard move
      // Human placement is handled by explicit placeExplodingKitten move
    }
  },

  /**
   * Game phases configuration - simplified for Phase 1
   */
  phases: {
    // Main playing phase - no separate setup needed
    playing: {
      start: true,
      turn: {
        order: TurnOrder.DEFAULT
      }
    }
  },  /**
   * Game end conditions
   */
  endIf: ({ G }) => {
    const alivePlayers = getAlivePlayers(G);

    // Single winner condition
    if (alivePlayers.length === 1) {
      return { winner: alivePlayers[0].id };
    }

    // Draw condition - deck empty and no exploding kittens remain
    if (G.deck.length === 0) {
      const explodingKittensInDeck = G.deck.filter(card => isExplodingKitten(card));
      if (explodingKittensInDeck.length === 0) {
        return { draw: true, winners: alivePlayers.map(p => p.id) };
      }
    }

    // Game continues
    return null;
  },

  /**
   * AI configuration for CPU players
   */
  ai: {
    /**
     * Enumerate possible moves for AI players
     * @param {Object} G - Game state
     * @param {Object} ctx - Game context
     * @returns {Array} Array of possible moves for current player
     */
    enumerate: ({ G, ctx }) => {
      const moves = [];
      const player = G.players[ctx.currentPlayer];

      // Don't enumerate for human player or eliminated players
      if (!player || !player.isCPU || player.isEliminated) {
        return moves;
      }

      // CPU players cannot have pending exploding kittens since they auto-place immediately
      // Human players with pending kittens get moves through UI (not AI enumeration)
      // Only enumerate normal moves for CPU players

      // For Phase 1, AI can play any card in hand
      player.hand.forEach((card, index) => {
        moves.push({ move: 'playCard', args: [index] });
      });

      // AI can always try to draw a card (if deck not empty)
      if (G.deck.length > 0) {
        moves.push({ move: 'drawCard', args: [] });
      }

      return moves;
    }
  },

  // Hide secret information from players
  playerView: PlayerView.STRIP_SECRETS,

  // Player configuration
  minPlayers: 4,
  maxPlayers: 4,

  // Deterministic randomness for consistent behavior
  seed: 'phase1-development'
};

export default ExplodingKittensGame;