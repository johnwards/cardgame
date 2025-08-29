/**
 * Phase 1: Core Game Foundation - boardgame.io Game Definition
 * 
 * This module implements the core boardgame.io game definition for Exploding Kittens Phase 1.
 * Phase 1 includes the essential gameplay loop with Regular cards, Exploding Kittens, and Defuse cards.
 * 
 * Game supports exactly 4 players: 1 human player and 3 CPU players.
 */

import { INVALID_MOVE, TurnOrder, PlayerView } from 'boardgame.io/core';
import { setupGameDeck, CARD_TYPES, isExplodingKitten, isDefuseCard } from '../constants/cards.js';

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
  return player.hand.some(card => isDefuseCard(card));
}

/**
 * Checks if a player can currently make moves in the game
 * Used by AI enumeration to determine if CPU players should generate moves
 * @param {Object} G - Game state object containing players and secret state
 * @param {string} playerID - Unique identifier of the player to check
 * @returns {boolean} True if player can make moves, false if blocked or eliminated
 * 
 * Returns false if:
 * - Player doesn't exist or is eliminated
 * - Player is human and has a pending exploding kitten placement
 * - Player is in an invalid state for move generation
 */
function canPlayerMakeMove(G, playerID) {
  const player = G.players[playerID];
  if (!player || player.isEliminated) return false;

  // If player has a pending exploding kitten and is not CPU, they can only place it
  if (G.secret.pendingExplodingKitten && !player.isCPU && G.secret.pendingExplodingKittenPlayer === playerID) {
    return false; // They must use placeExplodingKitten move, not enumerated moves
  }

  return true;
}

/**
 * Checks if a card can be played from a player's hand
 * In Phase 1, only non-exploding kitten cards can be played directly
 * @param {Object} card - Card object to validate for playing
 * @returns {boolean} True if card can be played, false otherwise
 * 
 * Returns false if:
 * - Card is null/undefined
 * - Card is an Exploding Kitten (these are only drawn, never played directly)
 * - Card has invalid structure (future validation)
 */
function canPlayCard(card) {
  return card && !isExplodingKitten(card);
}/**
 * Gets a random position in the deck for placing cards
 * Uses boardgame.io's deterministic random system for proper game synchronization
 * @param {Object} random - boardgame.io random object
 * @param {number} deckLength - Current length of the deck
 * @returns {number} Random position from 0 to deckLength (inclusive)
 */
function getRandomDeckPosition(random, deckLength) {
  // random.D(n) returns 1 to n, so subtract 1 to get 0 to n-1
  // Add 1 to deckLength to include position at end of deck
  return random.D(deckLength + 1) - 1;
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
   * Move definitions - Phase 2.1 implementation with complete validation and logic
   */
  moves: {
    /**
     * Play a card from player's hand to discard pile
     * @param {Object} G - Game state
     * @param {Object} ctx - Game context
     * @param {string} playerID - ID of player making the move
     * @param {number} cardIndex - Index of card in player's hand to play
     */
    playCard: ({ G, ctx, playerID }, cardIndex) => {
      // Comprehensive validation - return INVALID_MOVE for invalid actions
      const player = G.players[playerID];

      // Check if player exists and is not eliminated
      if (!player || player.isEliminated) {
        return INVALID_MOVE;
      }

      // Check if it's the player's turn
      if (ctx.currentPlayer !== playerID) {
        return INVALID_MOVE;
      }

      // Check if player has a pending exploding kitten that must be placed first
      if (G.secret.pendingExplodingKitten && !player.isCPU) {
        return INVALID_MOVE;
      }

      // Validate card index
      if (typeof cardIndex !== 'number' || cardIndex < 0 || cardIndex >= player.hand.length) {
        return INVALID_MOVE;
      }

      // Get the card to be played
      const card = player.hand[cardIndex];
      if (!card) {
        return INVALID_MOVE;
      }

      // In Phase 1, we don't allow playing Exploding Kittens directly
      // (they should only be drawn and then dealt with)
      if (isExplodingKitten(card)) {
        return INVALID_MOVE;
      }

      // Move card from hand to discard pile
      const playedCard = player.hand.splice(cardIndex, 1)[0];
      G.discardPile.push(playedCard);
      player.handSize = player.hand.length;

      // Update game metadata
      G.lastAction = `${player.name} played ${playedCard.name}`;

      // Important: Playing cards does NOT end turn in Exploding Kittens
      // Players must explicitly draw or use a turn-ending action
      // The turn continues and player can play more cards or draw
    },

    /**
     * Draw a card from the deck - this ALWAYS ends the turn
     * @param {Object} G - Game state
     * @param {Object} ctx - Game context
     * @param {string} playerID - ID of player making the move
     * @param {Object} events - Game events for turn management
     * @param {Object} random - boardgame.io random object for deterministic randomness
     */
    drawCard: ({ G, ctx, playerID, events, random }) => {
      // Comprehensive validation
      const player = G.players[playerID];

      // Check if player exists and is not eliminated
      if (!player || player.isEliminated) {
        return INVALID_MOVE;
      }

      // Check if it's the player's turn
      if (ctx.currentPlayer !== playerID) {
        return INVALID_MOVE;
      }

      // Check if player has a pending exploding kitten that must be placed first
      if (G.secret.pendingExplodingKitten && !player.isCPU) {
        return INVALID_MOVE;
      }

      // Check if deck is empty
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
        // Remove the exploding kitten from player's hand immediately
        const kittenIndex = player.hand.findIndex(card => isExplodingKitten(card));
        const explodingKitten = player.hand.splice(kittenIndex, 1)[0];
        player.handSize = player.hand.length;

        if (hasDefuseCard(player)) {
          // Player has defuse card - they survive but must place the kitten back
          const defuseCard = removeDefuseCard(player);
          G.discardPile.push(defuseCard);

          // Store the exploding kitten for placement - awaiting player choice
          G.secret.pendingExplodingKitten = explodingKitten;
          G.secret.pendingExplodingKittenPlayer = playerID;
          G.lastAction = `${player.name} defused an Exploding Kitten!`;

          // For CPU players: auto-place randomly and end turn
          // For human players: keep turn active until they place the kitten
          if (player.isCPU) {
            // CPU auto-places at random position and ends turn
            const randomPosition = getRandomDeckPosition(random, G.deck.length);
            G.deck.splice(randomPosition, 0, explodingKitten);
            G.secret.explodingKittenPositions.push(randomPosition);
            delete G.secret.pendingExplodingKitten;
            delete G.secret.pendingExplodingKittenPlayer;
            G.lastAction = `${player.name} placed the Exploding Kitten back in the deck`;
            events.endTurn();
          }
          // Human players: turn continues, they must use placeExplodingKitten move
        } else {
          // Player has no defuse card - they are eliminated
          player.isEliminated = true;
          G.lastAction = `${player.name} exploded and was eliminated!`;

          // Put the exploding kitten back in a random position in the deck
          const randomPosition = getRandomDeckPosition(random, G.deck.length);
          G.deck.splice(randomPosition, 0, explodingKitten);
          G.secret.explodingKittenPositions.push(randomPosition);

          events.endTurn();
        }
      } else {
        // Normal card drawn - turn ends immediately
        // Drawing a card ALWAYS ends your turn in Exploding Kittens
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
    placeExplodingKitten: ({ G, ctx, playerID, events }, position) => {
      // Comprehensive validation
      const player = G.players[playerID];

      // Check if player exists and is not eliminated
      if (!player || player.isEliminated) {
        return INVALID_MOVE;
      }

      // Check if it's the player's turn
      if (ctx.currentPlayer !== playerID) {
        return INVALID_MOVE;
      }

      // Check if there's a pending exploding kitten to place
      if (!G.secret.pendingExplodingKitten) {
        return INVALID_MOVE;
      }

      // Check if this player is the one who drew the exploding kitten
      if (G.secret.pendingExplodingKittenPlayer !== playerID) {
        return INVALID_MOVE;
      }

      // Validate position parameter
      if (typeof position !== 'number') {
        return INVALID_MOVE;
      }

      const explodingKitten = G.secret.pendingExplodingKitten;
      delete G.secret.pendingExplodingKitten;
      delete G.secret.pendingExplodingKittenPlayer;

      // Position validation with explicit constants for clarity
      const TOP_OF_DECK = 0;
      const BOTTOM_OF_DECK = G.deck.length;

      // Validate and clamp position to valid range [0, deck.length]
      // 0 = top of deck, deck.length = bottom of deck (after last card)
      const clampedPosition = Math.max(TOP_OF_DECK, Math.min(Math.floor(position), BOTTOM_OF_DECK));

      // Place kitten in deck at the specified position
      G.deck.splice(clampedPosition, 0, explodingKitten);
      G.secret.explodingKittenPositions.push(clampedPosition);

      G.lastAction = `${player.name} placed the Exploding Kitten back in the deck`;

      // End turn after placing kitten - this completes the draw action
      events.endTurn();
    }
  },

  /**
   * Turn configuration with proper boardgame.io integration
   */
  turn: {
    order: TurnOrder.DEFAULT,

    // Set move limits for proper turn management
    minMoves: 0, // Players can end turn without playing cards (by drawing)
    maxMoves: 10, // Reasonable limit to prevent infinite card playing

    /**
     * Turn begin handler - skip eliminated players and update game state
     */
    onBegin: ({ G, ctx, events }) => {
      const currentPlayer = G.players[ctx.currentPlayer];

      // Skip eliminated players automatically
      if (currentPlayer && currentPlayer.isEliminated) {
        events.endTurn();
        return;
      }

      // Update turn tracking
      G.totalTurns++;

      // Clear any previous turn state that shouldn't persist
      if (G.lastAction) {
        G.lastAction = null;
      }
    },

    /**
     * Turn end handler - cleanup and validation
     */
    onEnd: ({ G }) => {
      // Ensure hand sizes are accurate after turn
      Object.values(G.players).forEach(player => {
        player.handSize = player.hand.length;
      });

      // Clean up any temporary state that shouldn't persist between turns
      // Note: pendingExplodingKitten is intentionally preserved until placement
    }
  },

  /**
   * Game phases configuration with setup and playing phases
   */
  phases: {
    // Setup phase for game initialization and validation
    setup: {
      start: true,

      // Setup phase configuration
      turn: {
        order: TurnOrder.DEFAULT,
        minMoves: 0,
        maxMoves: 0 // No moves allowed during setup
      },

      // Setup moves (none needed for Phase 1, but structure for future)
      moves: {},

      // Automatically transition to playing phase
      next: 'playing',

      // End setup phase immediately after initialization
      endIf: ({ G }) => {
        // Setup is complete when all players have proper hands and deck is ready
        const allPlayersReady = Object.values(G.players).every(player =>
          player.hand.length === 8 && !player.isEliminated
        );
        const deckReady = G.deck.length === 24; // 56 total - 32 dealt = 24 remaining

        return allPlayersReady && deckReady;
      }
    },

    // Main playing phase where the actual game takes place
    playing: {
      // Turn configuration for playing phase
      turn: {
        order: TurnOrder.DEFAULT,
        minMoves: 0, // Players can end turn by just drawing
        maxMoves: 10 // Prevent infinite card playing
      },

      // All moves are available during playing phase
      moves: {
        playCard: true,
        drawCard: true,
        placeExplodingKitten: true
      },

      // Playing phase continues until game end
      endIf: () => {
        // Game ends when endIf returns a winner or draw
        return null;
      }
    }
  },  /**
   * Game end conditions - handles single winner and draw scenarios
   */
  endIf: ({ G, ctx }) => {
    const alivePlayers = getAlivePlayers(G);

    // Single winner condition - last player standing
    if (alivePlayers.length === 1) {
      return {
        winner: alivePlayers[0].id,
        winnerName: alivePlayers[0].name,
        reason: 'Last player remaining'
      };
    }

    // No players remaining (all exploded) - this shouldn't happen but handle it
    if (alivePlayers.length === 0) {
      return {
        draw: true,
        reason: 'All players eliminated'
      };
    }

    // Draw condition - deck empty and no exploding kittens remain in deck
    if (G.deck.length === 0) {
      const explodingKittensInDeck = G.deck.filter(card => isExplodingKitten(card));
      if (explodingKittensInDeck.length === 0) {
        return {
          draw: true,
          winners: alivePlayers.map(p => ({ id: p.id, name: p.name })),
          reason: 'Deck empty with no exploding kittens remaining'
        };
      }
    }

    // Game continues - check for stalled games (safety mechanism)
    if (ctx.turn > 1000) { // Reasonable upper limit for turns
      return {
        draw: true,
        winners: alivePlayers.map(p => ({ id: p.id, name: p.name })),
        reason: 'Game reached maximum turn limit'
      };
    }

    // Game continues
    return null;
  },

  /**
   * AI configuration for CPU players using boardgame.io's built-in MCTS bot
   */
  ai: {
    /**
     * Enumerate possible moves for AI players with enhanced decision logic
     * @param {Object} G - Game state
     * @param {Object} ctx - Game context
     * @param {string} playerID - ID of the player (for multi-player enumeration)
     * @returns {Array} Array of possible moves for current player
     */
    enumerate: ({ G, ctx, playerID }) => {
      const moves = [];
      const currentPlayerID = playerID || ctx.currentPlayer;
      const player = G.players[currentPlayerID];

      // Don't enumerate for human player or eliminated players
      if (!player || !player.isCPU || player.isEliminated) {
        return moves;
      }

      // Check if player can make moves (not blocked by pending exploding kitten)
      if (!canPlayerMakeMove(G, currentPlayerID)) {
        return moves;
      }

      // CPU players cannot have pending exploding kittens since they auto-place immediately
      // Human players with pending kittens get moves through UI (not AI enumeration)
      // Only enumerate normal moves for CPU players

      // Enhanced AI decision logic for Phase 1
      const playableCards = [];
      player.hand.forEach((card, index) => {
        if (canPlayCard(card)) {
          playableCards.push({ card, index });
        }
      });

      // Strategy: Balance between playing cards and drawing
      // CPU should sometimes play cards to manage hand size and sometimes draw to advance game
      
      // Add card playing moves with strategic weighting
      playableCards.forEach(({ index }) => {
        moves.push({ move: 'playCard', args: [index] });
      });

      // Always include draw option if deck has cards
      if (G.deck.length > 0) {
        moves.push({ move: 'drawCard', args: [] });
      }

      // For CPU decision making: prefer to play cards if hand is getting large (>6 cards)
      // or if they have many cards. This creates more dynamic gameplay.
      if (player.hand.length > 6 && playableCards.length > 0) {
        // Weight towards playing cards when hand is large
        // Add extra play card moves to increase probability
        playableCards.slice(0, 2).forEach(({ index }) => {
          moves.push({ move: 'playCard', args: [index] });
        });
      }

      return moves;
    },

    /**
     * Configure MCTS bot parameters for CPU players
     */
    bot: {
      // Number of iterations for MCTS simulation
      iterations: 100,
      
      // Enable objective function for better decision making
      objectives: {
        // Prefer moves that keep player alive (avoid risky draws when possible)
        survival: ({ G, playerID }) => {
          const player = G.players[playerID];
          if (!player || player.isEliminated) return 0;
          
          // Higher value for having defuse cards
          const defuseCards = player.hand.filter(card => isDefuseCard(card)).length;
          const survivalScore = defuseCards * 10;
          
          // Penalty for large hand size (more vulnerable to favor attacks in future phases)
          const handSizePenalty = Math.max(0, player.hand.length - 8) * 2;
          
          return survivalScore - handSizePenalty;
        },
        
        // Prefer moves that advance the game state
        progress: ({ G, ctx }) => {
          // Reward drawing cards to advance the game
          const turnProgress = ctx.turn * 0.1;
          
          // Reward having fewer total cards in play (closer to endgame)
          const totalCardsInPlay = Object.values(G.players)
            .filter(p => !p.isEliminated)
            .reduce((sum, p) => sum + p.hand.length, 0);
          const progressScore = Math.max(0, 32 - totalCardsInPlay) * 0.5;
          
          return turnProgress + progressScore;
        }
      }
    }
  },

  // Hide secret information from players using PlayerView.STRIP_SECRETS
  playerView: PlayerView.STRIP_SECRETS,

  // Player configuration for Phase 1 - exactly 4 players required
  minPlayers: 4,
  maxPlayers: 4,

  // Deterministic randomness for consistent testing and development
  seed: 'phase1-development',

  // Game metadata
  displayName: 'Exploding Kittens (Phase 1)',
  description: 'Core foundation with basic cards: Regular, Exploding Kittens, and Defuse cards'
};

export default ExplodingKittensGame;