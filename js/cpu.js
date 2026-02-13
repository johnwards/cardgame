/**
 * cpu.js - CPU Player AI for Exploding Viltrumites
 *
 * This module controls the computer-controlled players in the game.
 * Each CPU player picks a RANDOM legal move on each action - there is
 * no strategy here, just random selection from all valid options.
 *
 * A more advanced AI could weigh moves (e.g. prefer playing a Skip when
 * an Exploding Viltrumite is near the top of the deck), but random selection
 * keeps the code simple and is a good baseline to build upon.
 */

import {
  drawCard, playSkip, playAttack, playFavor, playShuffle,
  playSeeTheFuture, playCatPair, playSingleCat, placeExplodingViltrumite,
  getValidTargets
} from './game.js';


// ---------------------------------------------------------------------------
// 1. BOT CONFIGURATIONS
// ---------------------------------------------------------------------------

// Each CPU player has a different "thinking" speed to make the game feel
// more natural. Without delays, all CPU moves would happen instantly,
// which would be confusing for the human player to follow.
const BOT_CONFIGS = {
  1: { name: 'CPU 1', title: 'ThinkingBot', minDelay: 500, maxDelay: 2000 },
  2: { name: 'CPU 2', title: 'FastThinkingBot', minDelay: 200, maxDelay: 800 },
  3: { name: 'CPU 3', title: 'SlowThinkingBot', minDelay: 1000, maxDelay: 3000 }
};


// ---------------------------------------------------------------------------
// 2. HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * getThinkingDelay - Returns a random delay (in milliseconds) for a bot.
 *
 * This makes each CPU player "think" for a different amount of time,
 * giving the game a more natural feel. The delay is a random value
 * between the bot's configured minDelay and maxDelay.
 *
 * @param {number} playerIndex - Which CPU player (1, 2, or 3)
 * @returns {number} Delay in milliseconds
 */
function getThinkingDelay(playerIndex) {
  const config = BOT_CONFIGS[playerIndex];
  return config.minDelay + Math.random() * (config.maxDelay - config.minDelay);
}

/**
 * wait - Returns a Promise that resolves after the given number of milliseconds.
 *
 * This is used with `await` to pause the CPU's turn, simulating thinking time.
 * For example: `await wait(1000)` pauses for 1 second.
 *
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Resolves after the delay
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// ---------------------------------------------------------------------------
// 3. LEGAL MOVE GENERATION
// ---------------------------------------------------------------------------

/**
 * getLegalMoves - Enumerates ALL valid moves a CPU player can make.
 *
 * This is the key function for the AI. Before the CPU can pick a random
 * move, we need to know what moves are actually allowed. This function
 * checks the player's hand and the current game state to build a list
 * of every legal action.
 *
 * Special states (like needing to place an Exploding Viltrumite back in the
 * deck) are checked first, because they override normal play.
 *
 * @param {object} state - The current game state
 * @param {number} playerIndex - Which CPU player is taking their turn
 * @returns {Array} Array of move objects, each describing one legal action
 */
function getLegalMoves(state, playerIndex) {
  // --- Special state: waiting for a human to give us a card (Favor) ---
  // If a Favor card was played targeting the human, the human picks which
  // card to give. The CPU just has to wait.
  if (state.waitingForFavor === playerIndex) {
    return [{ type: 'waitForFavor' }];
  }

  // --- Special state: must place an Exploding Viltrumite back in the deck ---
  // The CPU drew an Exploding Viltrumite but had a Defuse card, so now they
  // must choose where in the deck to place the viltrumite back.
  if (state.pendingExplodingViltrumite && state.pendingPlayer === playerIndex) {
    return [
      { type: 'placeExplodingViltrumite', position: 0 },                                    // top of deck
      { type: 'placeExplodingViltrumite', position: Math.floor(state.deck.length / 3) },     // one-third down
      { type: 'placeExplodingViltrumite', position: Math.floor(state.deck.length * 2 / 3) }, // two-thirds down
      { type: 'placeExplodingViltrumite', position: state.deck.length }                      // bottom of deck
    ];
  }

  // --- Normal turn: check every card in hand for playable actions ---
  const moves = [];
  const validTargets = getValidTargets(state, playerIndex);
  const player = state.players[playerIndex];

  for (let i = 0; i < player.hand.length; i++) {
    const card = player.hand[i];

    switch (card.type) {
      // Simple action cards - just play them, no target needed
      case 'skip':
      case 'shuffle':
      case 'attack':
      case 'see_future':
        moves.push({ type: 'playCard', cardType: card.type, cardIndex: i });
        break;

      // Favor requires choosing a target player to steal from
      case 'favor':
        for (const targetId of validTargets) {
          moves.push({ type: 'playFavor', cardIndex: i, targetIndex: targetId });
        }
        break;

      // Cat cards can be played as pairs to steal a random card from someone
      case 'cat':
        // Count how many cats of the same name we have (need 2+ for a pair)
        const matchCount = player.hand.filter(c => c.type === 'cat' && c.name === card.name).length;
        if (matchCount >= 2) {
          for (const targetId of validTargets) {
            // Avoid duplicate moves - only add one playCatPair per cat name per target
            const alreadyAdded = moves.some(
              m => m.type === 'playCatPair' && m.cardName === card.name && m.targetIndex === targetId
            );
            if (!alreadyAdded) {
              moves.push({ type: 'playCatPair', cardName: card.name, targetIndex: targetId });
            }
          }
        }
        break;

      // Defuse and Exploding Viltrumite cards are never voluntarily played
      // - Defuse is used automatically when you draw an Exploding Viltrumite
      // - Exploding Viltrumite is never in a player's hand during normal play
    }
  }

  // Drawing a card is always an option (it ends the turn)
  if (state.deck.length > 0) {
    moves.push({ type: 'drawCard' });
  }

  return moves;
}


// ---------------------------------------------------------------------------
// 4. MOVE EXECUTION
// ---------------------------------------------------------------------------

/**
 * executeMove - Executes a single move by calling the appropriate game.js function.
 *
 * This is a dispatcher - it takes a move object (from getLegalMoves) and
 * calls the correct function from game.js to carry it out. The result is
 * returned with an extra `action` field so the caller knows what happened.
 *
 * @param {object} state - The current game state (will be mutated by game.js)
 * @param {number} playerIndex - Which CPU player is acting
 * @param {object} move - The move object describing what to do
 * @returns {object} Result from game.js plus an `action` identifier
 */
function executeMove(state, playerIndex, move) {
  switch (move.type) {
    case 'drawCard':
      return { ...drawCard(state, playerIndex), action: 'draw' };

    case 'playCard':
      // Route to the correct game function based on card type
      switch (move.cardType) {
        case 'skip':
          return { ...playSkip(state, playerIndex, move.cardIndex), action: 'skip' };
        case 'attack':
          return { ...playAttack(state, playerIndex, move.cardIndex), action: 'attack' };
        case 'shuffle':
          return { ...playShuffle(state, playerIndex, move.cardIndex), action: 'shuffle' };
        case 'see_future':
          return { ...playSeeTheFuture(state, playerIndex, move.cardIndex), action: 'see_future' };
      }
      break;

    case 'playFavor':
      return { ...playFavor(state, playerIndex, move.cardIndex, move.targetIndex), action: 'favor' };

    case 'playCatPair':
      return { ...playCatPair(state, playerIndex, move.cardName, move.targetIndex), action: 'catPair' };

    case 'placeExplodingViltrumite':
      return { ...placeExplodingViltrumite(state, move.position), action: 'placeViltrumite' };

    case 'waitForFavor':
      // Nothing to execute - just signal that we're waiting for the human
      return { action: 'waitForFavor', waiting: true };
  }
}


// ---------------------------------------------------------------------------
// 5. MAIN CPU TURN LOOP
// ---------------------------------------------------------------------------

/**
 * executeCPUTurn - Runs an entire CPU player's turn asynchronously.
 *
 * This is the main entry point called by the UI when it's a CPU player's turn.
 * It loops, picking and executing random moves, until the turn ends.
 *
 * A turn ends when the CPU:
 *   - Draws a card (this always ends the action loop)
 *   - Plays an Attack card (passes turn to next player)
 *   - Plays a Skip card and has no remaining turns
 *   - Places an Exploding Viltrumite and doesn't continue
 *
 * A turn does NOT end when the CPU plays:
 *   - Shuffle, See the Future, Favor, or Cat Pairs (these are "free" actions)
 *   - Skip when they still have turns remaining (from a previous Attack)
 *
 * The onStateChange callback is called after each move so the UI can
 * re-render and show the player what the CPU is doing.
 *
 * @param {object} state - The current game state
 * @param {number} playerIndex - Which CPU player is taking their turn
 * @param {function} onStateChange - Callback to trigger a UI re-render
 */
async function executeCPUTurn(state, playerIndex, onStateChange) {
  // Keep looping until the CPU's turn ends
  while (state.currentPlayer === playerIndex && !state.gameover) {
    // Simulate "thinking" - wait for a random delay based on bot personality
    await wait(getThinkingDelay(playerIndex));

    // Generate all legal moves for this CPU player
    const moves = getLegalMoves(state, playerIndex);

    // Safety check - if no moves are available, something unexpected happened
    if (moves.length === 0) break;

    // RANDOM SELECTION: Pick a move at random from all legal options.
    // This is the simplest possible AI - every legal move has an equal
    // chance of being chosen. A smarter AI could assign weights to
    // prefer certain moves over others.
    const move = moves[Math.floor(Math.random() * moves.length)];

    // Special case: if we're waiting for a human to resolve a Favor card,
    // we can't do anything yet - just poll and check again
    if (move.type === 'waitForFavor') {
      await wait(500);
      onStateChange(state); // Re-render to show the waiting state
      continue;
    }

    // Execute the chosen move (this mutates the game state)
    const result = executeMove(state, playerIndex, move);

    // Tell the UI to re-render so the human player can see what happened
    onStateChange(state);

    // --- Determine if the turn has ended ---

    // Drawing a card always ends the CPU's action loop.
    // (The game engine handles what happens next - either the turn passes
    // to the next player, or if an Attack was played, they draw again.)
    if (result.action === 'draw') break;

    // Playing Attack always ends this player's turn immediately
    // (the next player now has to take extra turns)
    if (result.action === 'attack') break;

    // Playing Skip might end the turn, or might just skip one of multiple
    // turns (if the CPU was under an Attack). Check the result.
    if (result.action === 'skip' && result.turnEnded) break;

    // After placing an Exploding Viltrumite back in the deck, check if
    // the CPU's turn continues (it might if they had multiple turns)
    if (result.action === 'placeViltrumite') {
      if (!result.continueTurn) break;
    }

    // If we reach here, the CPU played a "free" action card (Shuffle,
    // See the Future, Favor, Cat Pair) and their turn continues.
    // The while loop goes back to the top to pick another move.
  }
}


// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

export { BOT_CONFIGS, getLegalMoves, executeCPUTurn };
