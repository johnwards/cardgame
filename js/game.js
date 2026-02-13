/**
 * game.js - Core game engine for Exploding Viltrumites
 *
 * This module manages all game state and logic: setting up the game,
 * drawing cards, playing action cards, and determining when the game ends.
 *
 * Key concept: the entire game is represented by a single "state" object.
 * Every function takes this state, mutates it, and returns useful info
 * about what happened. This pattern makes the game easy to reason about
 * and debug - you can inspect the state at any point to see exactly
 * what's going on.
 *
 * The deck is an array where the LAST element is the top card (next to
 * be drawn). We use pop() to draw from the top, which is O(1) - much
 * faster than shift() which would be O(n) because it re-indexes every
 * element.
 */

import { CARD_TYPES, BASIC_TYPES, createCard, createDeck, shuffleDeck } from './cards.js';

// ---------------------------------------------------------------------------
// createGameState() - set up a brand new game
// ---------------------------------------------------------------------------
// The setup follows the official Exploding Viltrumites rules:
//   1. Build the full 50-card deck
//   2. Remove all Viltrumite Attacks and Hero Assist cards
//   3. Shuffle the remaining action/basic cards
//   4. Deal each player 1 Hero Assist + 7 action/basic cards = 8 cards each
//   5. Put leftover Hero Assist cards and Viltrumite Attacks back into the deck
//   6. Shuffle the final draw deck
//
// This ensures every player starts with a Hero Assist card (their first line
// of defence) and the Viltrumite Attacks are only in the draw pile, never
// dealt directly to a player's starting hand.

function createGameState() {
  // Step 1: Create all 50 cards
  const allCards = createDeck();

  // Step 2: Separate out special cards we don't want dealt to players
  const viltrumiteAttackCards = allCards.filter(card => card.type === 'viltrumite_attack');
  const heroAssistCards = allCards.filter(card => card.type === 'hero_assist');
  const actionCards = allCards.filter(card => card.type !== 'viltrumite_attack' && card.type !== 'hero_assist');

  // Step 3: Shuffle the action/basic cards before dealing
  shuffleDeck(actionCards);

  // Step 4: Create the four players and deal their starting hands
  // Each player gets 1 Hero Assist card + 7 action/basic cards = 8 cards
  const players = {};
  const playerNames = ['You', 'CPU 1', 'CPU 2', 'CPU 3'];

  for (let i = 0; i < 4; i++) {
    // Give one Hero Assist card from our separated pile
    const hand = [heroAssistCards[i]];

    // Deal 7 action/basic cards from the shuffled pile
    // splice(0, 7) removes the first 7 cards and returns them
    hand.push(...actionCards.splice(0, 7));

    players[i] = {
      id: i,
      name: playerNames[i],
      hand: hand,
      isEliminated: false,
      isCPU: i !== 0   // Player 0 is the human; the rest are CPU
    };
  }

  // Step 5: Build the draw deck from what's left
  // Remaining: 2 Hero Assist cards (6 total - 4 dealt) + 3 Viltrumite Attacks
  //          + 13 leftover action/basic cards = 18 cards
  const deck = [
    ...heroAssistCards.slice(4),   // The 2 undealt Hero Assist cards
    ...viltrumiteAttackCards,      // All 3 Viltrumite Attacks
    ...actionCards                 // The 13 remaining action/basic cards
  ];

  // Step 6: Shuffle the draw deck so Viltrumite Attacks are randomly placed
  shuffleDeck(deck);

  // Step 7: Build and return the complete game state object
  return {
    players,
    deck,                           // Last element = top card (use pop() to draw)
    discardPile: [],
    currentPlayer: 0,               // Player 0 (human) goes first
    turnNumber: 1,
    turnsRemaining: { 0: 1, 1: 1, 2: 1, 3: 1 },  // How many draws each player must take
    pendingViltrumiteAttack: null,   // Set when a player counters a Viltrumite Attack
    pendingPlayer: null,             // Which player needs to place the countered Viltrumite Attack
    pendingFavor: null,              // Player ID who played Favor and is waiting
    favorTarget: null,               // Player ID who must give a card
    waitingForFavor: null,           // Same as pendingFavor (used for UI checks)
    seeTheFutureCards: null,         // Top 3 cards shown to the player
    seeTheFuturePlayer: null,        // Which player used See the Future
    attackNotification: null,        // Info about an attack for UI display
    gameover: null                   // Set when only one player remains
  };
}

// ---------------------------------------------------------------------------
// getNextAlivePlayer(state, fromPlayer) - find the next player still in game
// ---------------------------------------------------------------------------
// Players sit in a circle: 0 -> 1 -> 2 -> 3 -> 0 -> ...
// We skip anyone who has been eliminated (hit by a Viltrumite Attack
// without a Hero Assist card). In the worst case we check all 4 seats.

function getNextAlivePlayer(state, fromPlayer) {
  let next = fromPlayer;

  // Loop through up to 4 players to find one that's alive
  for (let i = 0; i < 4; i++) {
    next = (next + 1) % 4;   // Wrap around: 3 + 1 = 0

    if (!state.players[next].isEliminated) {
      return next;
    }
  }

  // Should never reach here if the game hasn't ended
  return fromPlayer;
}

// ---------------------------------------------------------------------------
// checkGameOver(state) - see if only one player is left standing
// ---------------------------------------------------------------------------
// We count how many players are still alive. If only one remains, they
// win and we record the result in state.gameover.

function checkGameOver(state) {
  const alivePlayers = Object.values(state.players).filter(p => !p.isEliminated);

  if (alivePlayers.length === 1) {
    const winner = alivePlayers[0];
    state.gameover = {
      winner: winner.id,
      winnerName: winner.name,
      reason: `${winner.name} is the last player standing!`
    };
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// endTurn(state) - advance to the next player's turn
// ---------------------------------------------------------------------------
// Simple but essential: increment the turn counter and find who plays next.

function endTurn(state) {
  state.turnNumber++;
  state.currentPlayer = getNextAlivePlayer(state, state.currentPlayer);
  return state;
}

// ---------------------------------------------------------------------------
// drawCard(state, playerIndex) - draw the top card from the deck
// ---------------------------------------------------------------------------
// This is the most complex action because drawing a Viltrumite Attack
// triggers a chain of events:
//   - If the player has a Hero Assist card, they can counter it and must then
//     place the Viltrumite Attack back into the deck (handled by
//     placeViltrumiteAttack).
//   - If they don't have a Hero Assist, they're eliminated from the game.
//
// The turnsRemaining system handles the Attack card: when attacked, a
// player must draw multiple times before their turn ends.

function drawCard(state, playerIndex) {
  const player = state.players[playerIndex];

  // Pop the last element (top of deck)
  const card = state.deck.pop();

  // --- Viltrumite Attack drawn! ---
  if (card.type === 'viltrumite_attack') {
    // Check if the player has a Hero Assist card to save themselves
    const heroAssistIndex = player.hand.findIndex(c => c.type === 'hero_assist');

    if (heroAssistIndex !== -1) {
      // Player has a Hero Assist card - they survive!
      // Remove the Hero Assist from their hand and discard it
      const heroAssistCard = player.hand.splice(heroAssistIndex, 1)[0];
      state.discardPile.push(heroAssistCard);

      // The Viltrumite Attack must now be placed back into the deck
      // (the player chooses where - see placeViltrumiteAttack)
      state.pendingViltrumiteAttack = card;
      state.pendingPlayer = playerIndex;

      return { result: 'defused' };
    } else {
      // No Hero Assist card - player is eliminated!
      player.isEliminated = true;
      state.discardPile.push(card);

      // Check if the game is over (only one player left)
      checkGameOver(state);

      // Clean up this player's turns and move to the next player
      state.turnsRemaining[playerIndex] = 1;
      endTurn(state);

      return { result: 'exploded' };
    }
  }

  // --- Normal card drawn ---
  // Add the card to the player's hand
  player.hand.push(card);

  // Handle turnsRemaining (relevant when the player was attacked)
  if (state.turnsRemaining[playerIndex] > 1) {
    // Player still has more draws to take this turn sequence
    state.turnsRemaining[playerIndex]--;
    return { result: 'drawn', card, continueTurn: true };
  } else {
    // Player's turn is done - reset and move to next player
    state.turnsRemaining[playerIndex] = 1;
    endTurn(state);
    return { result: 'drawn', card, continueTurn: false };
  }
}

// ---------------------------------------------------------------------------
// placeViltrumiteAttack(state, position) - put a countered Viltrumite Attack back in deck
// ---------------------------------------------------------------------------
// After countering a Viltrumite Attack, the player secretly places it back
// anywhere in the draw deck. This is a key strategic decision:
//   - Position 0 = top of deck (next player draws it immediately)
//   - Position deck.length = bottom of deck (drawn last)
//
// The deck array stores the top card at the END, so we need to convert
// the player-facing position to an array index.

function placeViltrumiteAttack(state, position) {
  const card = state.pendingViltrumiteAttack;
  const playerIndex = state.pendingPlayer;

  // Convert position to array index
  // Position 0 (top) = end of array, position deck.length (bottom) = index 0
  const actualIndex = state.deck.length - position;
  state.deck.splice(actualIndex, 0, card);

  // Clear the pending state
  state.pendingViltrumiteAttack = null;
  state.pendingPlayer = null;

  // Handle turnsRemaining (same logic as drawing a normal card)
  if (state.turnsRemaining[playerIndex] > 1) {
    state.turnsRemaining[playerIndex]--;
    return { continueTurn: true };
  } else {
    state.turnsRemaining[playerIndex] = 1;
    endTurn(state);
    return { continueTurn: false };
  }
}

// ---------------------------------------------------------------------------
// playSkip(state, playerIndex, cardIndex) - skip drawing a card
// ---------------------------------------------------------------------------
// The Skip card ends your turn without drawing. If you've been attacked
// and owe multiple draws, a Skip only cancels ONE of those draws.

function playSkip(state, playerIndex, cardIndex) {
  const player = state.players[playerIndex];

  // Remove the Skip card from hand and discard it
  const card = player.hand.splice(cardIndex, 1)[0];
  state.discardPile.push(card);

  if (state.turnsRemaining[playerIndex] > 1) {
    // Under attack with multiple turns remaining - skip just one draw
    state.turnsRemaining[playerIndex]--;
    return { turnEnded: false, skipDraw: true };
  } else {
    // Normal turn - skip the draw and end the turn
    state.turnsRemaining[playerIndex] = 1;
    endTurn(state);
    return { turnEnded: true };
  }
}

// ---------------------------------------------------------------------------
// playAttack(state, playerIndex, cardIndex) - attack the next player
// ---------------------------------------------------------------------------
// The Attack card ends your turn immediately (no draw required) and
// forces the next player to take extra turns. The key rule is that
// attacks STACK: if you attack someone who was already attacked, they
// have to take even more turns.
//
// We ADD 1 to the target's turnsRemaining rather than setting it to 2,
// so consecutive attacks accumulate.

function playAttack(state, playerIndex, cardIndex) {
  const player = state.players[playerIndex];

  // Remove the Attack card from hand and discard it
  const card = player.hand.splice(cardIndex, 1)[0];
  state.discardPile.push(card);

  // Find the next alive player (the target of the attack)
  const targetPlayer = getNextAlivePlayer(state, playerIndex);

  // Stack the attack: add 1 extra turn to the target's remaining turns
  state.turnsRemaining[targetPlayer] += 1;

  // If the target is the human player, set up a notification for the UI
  if (targetPlayer === 0) {
    state.attackNotification = {
      attackerName: player.name,
      targetPlayer: targetPlayer,
      remainingTurns: state.turnsRemaining[targetPlayer],
      timestamp: Date.now()
    };
  }

  // The attacking player's turn ends immediately (no draw needed)
  endTurn(state);

  return { targetPlayer, turnEnded: true };
}

// ---------------------------------------------------------------------------
// playFavor(state, playerIndex, cardIndex, targetIndex) - ask for a card
// ---------------------------------------------------------------------------
// The Favor card forces another player to give you a card of THEIR choice.
// When a CPU is the target, the game auto-resolves by picking a random card.
// When the human is the target, we pause and wait for their input.
//
// This does NOT end the turn - the player still needs to draw a card.

function playFavor(state, playerIndex, cardIndex, targetIndex) {
  const player = state.players[playerIndex];
  const target = state.players[targetIndex];

  // Validate the target
  if (target.isEliminated || targetIndex === playerIndex || target.hand.length === 0) {
    return { resolved: false, invalid: true };
  }

  // Remove the Favor card from hand and discard it
  const card = player.hand.splice(cardIndex, 1)[0];
  state.discardPile.push(card);

  if (target.isCPU) {
    // CPU target: automatically give a random card
    const randomIndex = Math.floor(Math.random() * target.hand.length);
    const givenCard = target.hand.splice(randomIndex, 1)[0];
    player.hand.push(givenCard);
    return { resolved: true, card: givenCard };
  } else {
    // Human target (player 0): wait for them to choose which card to give
    state.pendingFavor = playerIndex;
    state.favorTarget = 0;
    state.waitingForFavor = playerIndex;
    return { resolved: false, waitingForHuman: true };
  }
}

// ---------------------------------------------------------------------------
// resolveFavor(state, cardIndex) - human gives a card to the requesting player
// ---------------------------------------------------------------------------
// Called when the human player has chosen which card to give away in
// response to a Favor card played against them.

function resolveFavor(state, cardIndex) {
  const humanPlayer = state.players[state.favorTarget];
  const requester = state.players[state.pendingFavor];

  // Transfer the chosen card from human to requester
  const card = humanPlayer.hand.splice(cardIndex, 1)[0];
  requester.hand.push(card);

  // Clear the pending favor state
  state.pendingFavor = null;
  state.favorTarget = null;
  state.waitingForFavor = null;

  return card;
}

// ---------------------------------------------------------------------------
// playShuffle(state, playerIndex, cardIndex) - shuffle the draw pile
// ---------------------------------------------------------------------------
// A simple but powerful card: it randomises the entire draw deck.
// Useful when you've seen the top cards (via See the Future) and don't
// like what's coming, or to disrupt another player's plans.
//
// Does NOT end the turn - the player still needs to draw.

function playShuffle(state, playerIndex, cardIndex) {
  const player = state.players[playerIndex];

  // Remove the Shuffle card from hand and discard it
  const card = player.hand.splice(cardIndex, 1)[0];
  state.discardPile.push(card);

  // Shuffle the draw deck using Fisher-Yates from cards.js
  shuffleDeck(state.deck);
}

// ---------------------------------------------------------------------------
// playSeeTheFuture(state, playerIndex, cardIndex) - peek at top 3 cards
// ---------------------------------------------------------------------------
// Lets you look at the top 3 cards of the deck without changing their
// order. This is purely information - you don't draw or rearrange them.
//
// For the human player, we store the cards so the UI can display them.
// For CPU players, the AI logic can use this info internally.
//
// deck.slice(-3) gets the last 3 elements (top of deck).
// .reverse() puts them in draw order (first element = next to draw).
//
// Does NOT end the turn.

function playSeeTheFuture(state, playerIndex, cardIndex) {
  const player = state.players[playerIndex];

  // Remove the See the Future card from hand and discard it
  const card = player.hand.splice(cardIndex, 1)[0];
  state.discardPile.push(card);

  if (playerIndex === 0) {
    // Human player: store the top 3 cards for the UI to display
    // slice(-3) gets the last 3 elements, reverse() puts them in draw order
    state.seeTheFutureCards = state.deck.slice(-3).reverse();
    state.seeTheFuturePlayer = playerIndex;
  }

  // For CPU players, no visible state change (AI handles this internally)
}

// ---------------------------------------------------------------------------
// playBasicPair(state, playerIndex, cardName, targetIndex) - steal with a pair
// ---------------------------------------------------------------------------
// If you have two basic cards of the SAME type (e.g., two Viltrum Relics),
// you can play them as a pair to steal a random card from another player.
//
// We find the two matching cards by name, remove them from hand, and
// take a random card from the target player.
//
// Does NOT end the turn.

function playBasicPair(state, playerIndex, cardName, targetIndex) {
  const player = state.players[playerIndex];
  const target = state.players[targetIndex];

  // Find and remove the first matching basic card
  const firstIndex = player.hand.findIndex(c => c.name === cardName);
  const firstCard = player.hand.splice(firstIndex, 1)[0];
  state.discardPile.push(firstCard);

  // Find and remove the second matching basic card
  // (findIndex searches the updated hand after the first was removed)
  const secondIndex = player.hand.findIndex(c => c.name === cardName);
  const secondCard = player.hand.splice(secondIndex, 1)[0];
  state.discardPile.push(secondCard);

  // Steal a random card from the target
  const randomIndex = Math.floor(Math.random() * target.hand.length);
  const stolenCard = target.hand.splice(randomIndex, 1)[0];
  player.hand.push(stolenCard);

  return { stolenCard };
}

// ---------------------------------------------------------------------------
// playSingleBasic(state, playerIndex, cardIndex) - play one basic card alone
// ---------------------------------------------------------------------------
// A single basic card has no effect on its own - you need a pair to steal.
// Playing one just discards it. This might be useful to thin your hand
// or bluff other players.
//
// Does NOT end the turn.

function playSingleBasic(state, playerIndex, cardIndex) {
  const player = state.players[playerIndex];

  // Remove the basic card from hand and discard it (no effect)
  const card = player.hand.splice(cardIndex, 1)[0];
  state.discardPile.push(card);
}

// ---------------------------------------------------------------------------
// getValidTargets(state, playerIndex) - who can be targeted by cards?
// ---------------------------------------------------------------------------
// Returns an array of player IDs that are valid targets for cards like
// Favor and Basic Pair. A valid target must be:
//   - Not eliminated
//   - Not the player themselves
//   - Have at least one card in hand (so there's something to take)

function getValidTargets(state, playerIndex) {
  return Object.values(state.players)
    .filter(p => !p.isEliminated && p.id !== playerIndex && p.hand.length > 0)
    .map(p => p.id);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export {
  createGameState,
  getNextAlivePlayer,
  checkGameOver,
  endTurn,
  drawCard,
  placeViltrumiteAttack,
  playSkip,
  playAttack,
  playFavor,
  resolveFavor,
  playShuffle,
  playSeeTheFuture,
  playBasicPair,
  playSingleBasic,
  getValidTargets
};
