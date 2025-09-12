/**
 * Simple ThinkingBot - Just like RandomBot but with artificial thinking delays
 * 
 * Based directly on boardgame.io's RandomBot but adds a random delay before returning moves.
 */

import { Bot } from 'boardgame.io/ai';

/**
 * Bot that picks a move at random but waits a bit before deciding (like a human)
 */
export class ThinkingBot extends Bot {
  async play({ G, ctx }, playerID) {
    const moves = this.enumerate(G, ctx, playerID);

    // Add random thinking time between 500ms and 2000ms
    const thinkingTime = 500 + Math.random() * 1500;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    // Pick random move just like RandomBot
    return Promise.resolve({ action: this.random(moves) });
  }
}

/**
 * Fast thinking bot - quicker decisions
 */
export class FastThinkingBot extends Bot {
  async play({ G, ctx }, playerID) {
    const moves = this.enumerate(G, ctx, playerID);

    // Faster thinking time: 200ms to 800ms
    const thinkingTime = 200 + Math.random() * 600;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    return Promise.resolve({ action: this.random(moves) });
  }
}

/**
 * Slow thinking bot - more deliberate decisions  
 */
export class SlowThinkingBot extends Bot {
  async play({ G, ctx }, playerID) {
    const moves = this.enumerate(G, ctx, playerID);

    // Slower thinking time: 1000ms to 3000ms
    const thinkingTime = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    return Promise.resolve({ action: this.random(moves) });
  }
}

export default ThinkingBot;