/**
 * AI Bots with artificial thinking delays to simulate human-like behavior
 */

import { Bot } from 'boardgame.io/ai';

export class ThinkingBot extends Bot {
  async play({ G, ctx }, playerID) {
    const moves = this.enumerate(G, ctx, playerID);

    const thinkingTime = 500 + Math.random() * 1500;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    return Promise.resolve({ action: this.random(moves) });
  }
}

export class FastThinkingBot extends Bot {
  async play({ G, ctx }, playerID) {
    const moves = this.enumerate(G, ctx, playerID);

    const thinkingTime = 200 + Math.random() * 600;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    return Promise.resolve({ action: this.random(moves) });
  }
}

export class SlowThinkingBot extends Bot {
  async play({ G, ctx }, playerID) {
    const moves = this.enumerate(G, ctx, playerID);

    const thinkingTime = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, thinkingTime));

    return Promise.resolve({ action: this.random(moves) });
  }
}

export default ThinkingBot;