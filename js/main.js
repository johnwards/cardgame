/**
 * main.js - Entry point for the Exploding Kittens game
 *
 * This file wires everything together. It creates the game state, sets up
 * the render cycle, and defines callbacks that connect user actions (clicking
 * cards, pressing buttons) to the game logic in game.js.
 *
 * The flow of the game works like this:
 *
 *   1. Human plays a card or draws  -->  game state updates  -->  UI re-renders
 *   2. If the turn passes to a CPU   -->  CPU turn loop runs  -->  UI re-renders after each move
 *   3. CPU turns loop until it's the human's turn again
 *
 * There is one tricky interaction: when a CPU plays Favor targeting the
 * human player. The CPU turn loop enters a polling wait (checking every
 * 500ms). The human picks a card to give via onGiveFavorCard, which clears
 * the waiting state. The CPU's polling loop then detects the change and
 * continues automatically - we do NOT need to restart the CPU turn loop.
 */

import {
  createGameState,
  drawCard,
  playSkip,
  playAttack,
  playFavor,
  resolveFavor,
  playShuffle,
  playSeeTheFuture,
  playCatPair,
  playSingleCat,
  placeExplodingKitten,
  getValidTargets
} from './game.js';

import { executeCPUTurn } from './cpu.js';

import { renderGame, showTargetSelectionModal, showCatPairStealModal } from './ui.js';


// ==========================================================================
// 1. GAME STATE - the single source of truth for the entire game
// ==========================================================================
// createGameState() builds a fresh game: shuffled deck, dealt hands, and
// all tracking variables initialised. See game.js for details.

const state = createGameState();


// ==========================================================================
// 2. RENDER FUNCTION - update the UI to match the current state
// ==========================================================================
// Every time the game state changes (after playing a card, drawing, etc.)
// we call render() to refresh the entire UI. The callbacks object lets
// the UI trigger actions back in this file when the player clicks things.

function render() {
  renderGame(state, callbacks);
}


// ==========================================================================
// 3. CPU TURN MANAGEMENT
// ==========================================================================

/**
 * checkAndRunCPUTurns - Start CPU turns if the current player is a CPU.
 *
 * This is called after every human action that might end their turn.
 * If the current player is now a CPU, we kick off the CPU turn loop.
 * If it's still the human's turn (or the game is over), nothing happens.
 */
function checkAndRunCPUTurns() {
  if (state.currentPlayer !== 0 && !state.gameover) {
    runCPUTurns();
  }
}

/**
 * runCPUTurns - Execute CPU turns in sequence until it's the human's turn.
 *
 * This is an async function because each CPU turn involves delays (to
 * simulate "thinking time"). The while loop keeps going through CPU
 * players until the turn comes back to the human (player 0) or the
 * game ends.
 *
 * Each call to executeCPUTurn() handles one complete CPU turn, including
 * playing multiple cards and eventually drawing. The render callback
 * passed to executeCPUTurn() updates the UI after every individual move.
 */
async function runCPUTurns() {
  while (state.currentPlayer !== 0 && !state.gameover) {
    // Remember which CPU is playing (the turn may change during execution)
    const currentCPU = state.currentPlayer;

    // Run the CPU's entire turn - this awaits until the turn is complete.
    // The arrow function () => render() is called after each individual
    // CPU move so the human can see what's happening step by step.
    await executeCPUTurn(state, currentCPU, () => render());

    // After the CPU turn finishes, render one more time to show the
    // final state (e.g. updated current player indicator)
    render();
  }
}


// ==========================================================================
// 4. CALLBACKS - connect UI actions to game logic
// ==========================================================================
// The callbacks object is passed to renderGame(). When the player clicks
// a card, draws, places a kitten, etc., the UI calls the matching callback.
// Each callback updates the game state and re-renders.

const callbacks = {

  // --------------------------------------------------------------------------
  // onPlayCard(cardIndex) - Human plays a card from their hand
  // --------------------------------------------------------------------------
  // Different card types have different effects and flows. Some end the
  // turn (skip, attack), some show modals (favor, cat pair, see future),
  // and some just modify the deck (shuffle).

  onPlayCard(cardIndex) {
    const card = state.players[0].hand[cardIndex];
    if (!card) return;

    switch (card.type) {

      // SKIP: End your turn without drawing a card
      case 'skip':
        playSkip(state, 0, cardIndex);
        render();
        checkAndRunCPUTurns();
        break;

      // ATTACK: End your turn and force the next player to take extra turns
      case 'attack':
        playAttack(state, 0, cardIndex);
        render();
        checkAndRunCPUTurns();
        break;

      // SHUFFLE: Randomise the draw deck (does NOT end your turn)
      case 'shuffle':
        playShuffle(state, 0, cardIndex);
        render();
        break;

      // SEE THE FUTURE: Peek at the top 3 cards (does NOT end your turn)
      // A modal pops up showing the cards. The player must dismiss it
      // before they can continue playing or drawing.
      case 'see_future':
        playSeeTheFuture(state, 0, cardIndex);
        render();
        break;

      // FAVOR: Force another player to give you a card of their choice
      // Shows a target selection modal so the human can pick who to target.
      case 'favor':
        showTargetSelectionModal(
          state,
          'Favor',
          '\u{1F91D}',
          (targetId) => {
            // Target selected - play the favor card.
            // IMPORTANT: After the modal was shown, the player's hand may
            // have been re-indexed by other state changes. We look up the
            // card by its unique ID to find the correct index.
            const newCardIndex = state.players[0].hand.findIndex(c => c.id === card.id);
            if (newCardIndex === -1) return;

            playFavor(state, 0, newCardIndex, targetId);
            render();
          },
          () => {
            // Cancel - close the modal and re-render
            render();
          }
        );
        break;

      // CAT CARDS: Need a matching pair to steal a random card from someone
      case 'cat': {
        // Count how many cats of the same name are in hand
        const matchingCats = state.players[0].hand.filter(
          c => c.type === 'cat' && c.name === card.name
        );

        if (matchingCats.length >= 2) {
          // Has a pair! Show target selection to choose who to steal from
          const validTargets = getValidTargets(state, 0);
          if (validTargets.length === 0) {
            // No valid targets (all opponents eliminated or have no cards)
            render();
            return;
          }

          showTargetSelectionModal(
            state,
            `Play ${card.name} Pair`,
            card.emoji,
            (targetId) => {
              // Target selected - now show face-down cards to "pick" from.
              // (The actual stolen card is random, but this adds drama!)
              showCatPairStealModal(
                state,
                targetId,
                (cardPickIndex) => {
                  // Steal a random card from the target
                  playCatPair(state, 0, card.name, targetId);
                  render();
                },
                () => {
                  // Cancel steal selection - re-render to close modal
                  render();
                }
              );
            },
            () => {
              // Cancel target selection - re-render to close modal
              render();
            }
          );
        } else {
          // Single cat with no pair - just discard it (no effect)
          playSingleCat(state, 0, cardIndex);
          render();
        }
        break;
      }

      // Exploding Kitten and Defuse cards are never played from hand manually.
      // Defuse is used automatically when an Exploding Kitten is drawn.
    }
  },


  // --------------------------------------------------------------------------
  // onDrawCard() - Human draws the top card from the deck
  // --------------------------------------------------------------------------
  // Drawing always happens at the end of a turn. The result tells us what
  // happened and whether the turn continues (e.g. if the player was attacked
  // and still owes more draws).

  onDrawCard() {
    const result = drawCard(state, 0);
    render();

    if (result.result === 'drawn' && !result.continueTurn) {
      // Normal draw - turn is over, pass to the next player
      checkAndRunCPUTurns();
    } else if (result.result === 'drawn' && result.continueTurn) {
      // Player was attacked - they must draw again (still their turn)
      // Don't trigger CPU turns yet
    } else if (result.result === 'defused') {
      // Drew an Exploding Kitten but had a Defuse card!
      // The UI now shows placement buttons - wait for onPlaceKitten
    } else if (result.result === 'exploded') {
      // Player eliminated (no Defuse card) - move to next player
      checkAndRunCPUTurns();
    }
  },


  // --------------------------------------------------------------------------
  // onPlaceKitten(position) - Human places a defused Exploding Kitten in deck
  // --------------------------------------------------------------------------
  // After defusing, the player chooses where to put the kitten back.
  // Position 0 = top (next player draws it), higher = deeper in deck.

  onPlaceKitten(position) {
    const result = placeExplodingKitten(state, position);
    render();

    if (!result.continueTurn) {
      // Turn ended - pass to the next player
      checkAndRunCPUTurns();
    }
    // If continueTurn is true, the player was attacked and still has turns
    // remaining. They stay as the current player and can play or draw again.
  },


  // --------------------------------------------------------------------------
  // onSelectTarget(targetId) - Target selection for favor/cat pair
  // --------------------------------------------------------------------------
  // This is handled within the onPlayCard modal callbacks above, so this
  // callback exists for completeness but doesn't need its own logic.

  onSelectTarget(targetId) {
    // Handled by the modal callbacks in onPlayCard
  },


  // --------------------------------------------------------------------------
  // onGiveFavorCard(cardIndex) - Human gives a card when targeted by Favor
  // --------------------------------------------------------------------------
  // When a CPU plays Favor targeting the human, the CPU turn loop enters
  // a polling wait. The human picks a card to give, which calls this.
  // resolveFavor clears the waiting state, so the CPU's polling loop
  // automatically detects the change and continues - we do NOT need to
  // restart runCPUTurns() here.

  onGiveFavorCard(cardIndex) {
    resolveFavor(state, cardIndex);
    render();
    // The CPU turn loop (runCPUTurns) is still running in the background.
    // It was polling via executeCPUTurn's waitForFavor loop. Now that
    // waitingForFavor has been cleared, the loop will continue on its
    // next poll cycle. No need to call checkAndRunCPUTurns() here.
  },


  // --------------------------------------------------------------------------
  // onDismissModal() - Close a modal (see future, attack notification)
  // --------------------------------------------------------------------------
  // Some modals block play until dismissed. After dismissing, we check
  // if CPU turns should run (e.g. if the human was attacked and the
  // attack notification modal was showing).

  onDismissModal() {
    render();

    // Only trigger CPU turns if it's NOT the human's turn.
    // For example, after dismissing See the Future during the human's
    // turn, they should continue playing - not trigger CPU turns.
    if (state.currentPlayer !== 0) {
      checkAndRunCPUTurns();
    }
  },


  // --------------------------------------------------------------------------
  // onNewGame() - Start a fresh game
  // --------------------------------------------------------------------------
  // The simplest way to reset everything is to reload the page. This
  // clears all state, re-imports modules, and starts from scratch.

  onNewGame() {
    window.location.reload();
  },


  // --------------------------------------------------------------------------
  // onCancelTargetSelection() - Cancel a target selection modal
  // --------------------------------------------------------------------------

  onCancelTargetSelection() {
    render();
  }
};


// ==========================================================================
// 5. START THE GAME
// ==========================================================================
// Perform the initial render to show the starting game state. Player 0
// (the human) goes first, so we don't need to trigger CPU turns - the
// human will play cards or draw, and CPU turns will start automatically
// when the turn passes.

render();
