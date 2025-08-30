/**
 * CPU Player Logic - Phase C.2 Implementation
 * 
 * Handles automatic CPU player actions with appropriate delays
 * to create a natural game flow experience.
 */

import { CARD_TYPES } from '../constants/cards.js';

export class CPUPlayer {
  constructor() {
    this.cpuTimers = new Map();
  }

  // Schedule a CPU move with a delay
  scheduleCPUMove(G, ctx, moves, playerID, delay = 1500) {
    // Clear any existing timer for this player
    if (this.cpuTimers.has(playerID)) {
      clearTimeout(this.cpuTimers.get(playerID));
    }

    // Schedule the CPU move
    const timer = setTimeout(() => {
      this.executeCPUMove(G, ctx, moves, playerID);
      this.cpuTimers.delete(playerID);
    }, delay);

    this.cpuTimers.set(playerID, timer);
  }

  // Execute a CPU move using the game's AI logic
  executeCPUMove(G, ctx, moves, playerID) {
    console.log('=== EXECUTING CPU MOVE ===');
    console.log('CPU Player:', playerID);

    // Don't execute if it's not this player's turn
    if (ctx.currentPlayer !== playerID.toString()) {
      console.log('Not CPU player turn, skipping');
      return;
    }

    // Don't execute if player is eliminated
    if (G.players[playerID]?.isEliminated) {
      console.log('CPU player eliminated, skipping');
      return;
    }

    // Don't execute if game is over
    if (ctx.gameover) {
      console.log('Game over, skipping CPU move');
      return;
    }

    // Get possible moves using the game's AI logic
    const possibleMoves = this.enumerateCPUMoves(G, ctx, playerID);
    
    if (possibleMoves.length === 0) {
      console.log('No moves available for CPU player');
      return;
    }

    // Select a move (random for now, but could be smarter)
    const selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    console.log('CPU selected move:', selectedMove.move, 'with args:', selectedMove.args);

    // Execute the move
    try {
      if (moves[selectedMove.move]) {
        moves[selectedMove.move](...(selectedMove.args || []));
        console.log('CPU move executed successfully');
      } else {
        console.error('Move not found:', selectedMove.move);
      }
    } catch (error) {
      console.error('Error executing CPU move:', error);
    }

    console.log('=== CPU MOVE COMPLETE ===');
  }

  // Replicate the AI enumerate logic from the game
  enumerateCPUMoves(G, ctx, playerID) {
    // Only provide moves for CPU players
    if (!G.players[playerID]?.isCPU) {
      return [];
    }

    // Don't provide moves if it's not this player's turn
    if (ctx.currentPlayer !== playerID.toString()) {
      return [];
    }

    // Don't provide moves if player is eliminated
    if (G.players[playerID]?.isEliminated) {
      return [];
    }

    const moves = [];

    // Handle pending exploding kitten placement first
    if (G.pendingExplodingKitten && G.pendingPlayer === playerID) {
      // CPU strategy: Place randomly in deck (weighted toward bottom for self-preservation)
      const deckLength = G.deck.length;
      const positions = [
        { pos: 0, weight: 1 }, // Top of deck (dangerous)
        { pos: Math.floor(deckLength / 3), weight: 2 }, // Upper third
        { pos: Math.floor(deckLength * 2 / 3), weight: 3 }, // Lower third
        { pos: deckLength, weight: 4 } // Bottom (safest)
      ];
      
      // Weighted random selection
      const totalWeight = positions.reduce((sum, p) => sum + p.weight, 0);
      const random = Math.random() * totalWeight;
      let currentWeight = 0;
      
      for (const posData of positions) {
        currentWeight += posData.weight;
        if (random <= currentWeight) {
          moves.push({ move: 'placeExplodingKitten', args: [posData.pos] });
          break;
        }
      }
      
      return moves;
    }

    // Normal turn decision making
    const player = G.players[playerID];
    
    // Enhanced AI strategy
    const regularCards = player.hand.filter(card => card.type === CARD_TYPES.REGULAR);
    
    // Higher chance to play card if hand is getting large
    const handSizeBonus = Math.min(player.hand.length * 0.05, 0.2);
    const shouldPlayCard = Math.random() < (0.4 + handSizeBonus);
    
    if (shouldPlayCard && regularCards.length > 0) {
      // Find playable regular cards
      const playableCards = player.hand
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => card.type === CARD_TYPES.REGULAR);
      
      if (playableCards.length > 0) {
        // Play a random regular card
        const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
        moves.push({ move: 'playCard', args: [randomCard.index] });
      }
    }

    // Always include draw option
    if (G.deck.length > 0) {
      moves.push({ move: 'drawCard', args: [] });
    }

    return moves;
  }

  // Clean up all timers
  cleanup() {
    for (const timer of this.cpuTimers.values()) {
      clearTimeout(timer);
    }
    this.cpuTimers.clear();
  }
}

// Create singleton instance
export const cpuPlayer = new CPUPlayer();