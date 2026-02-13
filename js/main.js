/**
 * main.js - Entry point for the Exploding Viltrumites game
 *
 * =====================================================================
 * This file follows the pseudocode state-machine pattern:
 *
 *   GLOBAL Game
 *     ATTRIBUTE state            ← which screen we're on
 *     ATTRIBUTE players
 *     ATTRIBUTE currentPlayerIndex
 *     ATTRIBUTE deck
 *     ATTRIBUTE discardPile
 *     ATTRIBUTE attackActive
 *     ATTRIBUTE attackTimer
 *
 *     METHOD Constructor()       ← set state to "MAIN_MENU"
 *     METHOD ChangeState(s)      ← switch to a new state
 *     METHOD Update()            ← call the right update for the current state
 *   END GLOBAL
 * =====================================================================
 *
 * The Game class holds ALL game data and a `state` string that controls
 * which screen is active.  The Update() method checks the state and
 * delegates to the matching handler - exactly like the pseudocode.
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
  placeExplodingViltrumite,
  getValidTargets
} from './game.js';

import { executeCPUTurn } from './cpu.js';

import { renderGame, showTargetSelectionModal, showCatPairStealModal } from './ui.js';


// ==========================================================================
// GLOBAL Game
// ==========================================================================
// This class mirrors the pseudocode exactly.  Every ATTRIBUTE from the
// pseudocode is a property, and each METHOD is a real method.
// ==========================================================================

class Game {

  // --- ATTRIBUTES (declared as class fields) ---
  state            = "MAIN_MENU";    // which screen is active
  players          = [];             // array of player objects
  currentPlayerIndex = 0;            // whose turn it is
  deck             = [];             // draw pile
  discardPile      = [];             // discard pile
  attackActive     = false;          // is an attack in progress?
  attackTimer      = 0;              // how many extra turns remain


  // -----------------------------------------------------------------------
  // METHOD Constructor()  –  pseudocode lines 10-15
  // -----------------------------------------------------------------------
  // Set the initial state and prepare empty attributes.
  // The real card data is created later when the player clicks PLAY.
  // -----------------------------------------------------------------------
  constructor() {
    this.state         = "MAIN_MENU";
    this.discardPile   = [];
    this.attackActive  = false;
    this.attackTimer   = 0;
    this._gameData     = {};          // internal: holds the full game state object
  }


  // -----------------------------------------------------------------------
  // METHOD ChangeState(newState)  –  pseudocode lines 17-19
  // -----------------------------------------------------------------------
  changeState(newState) {
    this.state = newState;
    this.update();                    // immediately act on the new state
  }


  // -----------------------------------------------------------------------
  // METHOD Update()  –  pseudocode lines 21-33
  // -----------------------------------------------------------------------
  // This is the main state-machine switch.  It checks which state we are
  // in and calls the matching handler - exactly like the IF / ELSE IF
  // chain in the pseudocode.
  // -----------------------------------------------------------------------
  update() {
    if (this.state === "MAIN_MENU") {
      this.mainMenuUpdate();

    } else if (this.state === "GAMEPLAY") {
      this.gameplayUpdate();

    } else if (this.state === "PAUSED") {
      this.pauseMenuUpdate();

    } else if (this.state === "GAME_OVER") {
      this.gameOverUpdate();

    } else if (this.state === "WIN") {
      this.winUpdate();
    }
  }


  // =====================================================================
  //  State handlers  –  one method per state
  // =====================================================================

  // --- MAIN_MENU ----------------------------------------------------------
  mainMenuUpdate() {
    const startScreen = document.getElementById('start-screen');
    const gameScreen  = document.getElementById('game-screen');

    // Show start screen, hide game screen
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden', 'fade-out');
  }

  // --- GAMEPLAY -----------------------------------------------------------
  gameplayUpdate() {
    const startScreen = document.getElementById('start-screen');
    const gameScreen  = document.getElementById('game-screen');

    // Create a fresh card game (shuffled deck, dealt hands, etc.)
    const freshState = createGameState();

    // Copy every property into our Game object so the rest of the
    // codebase can keep using game._gameData as the state object
    this._gameData     = freshState;
    this.players       = freshState.players;
    this.deck          = freshState.deck;
    this.discardPile   = freshState.discardPile;
    this.currentPlayerIndex = freshState.currentPlayer;
    this.attackActive  = freshState.attackActive ?? false;
    this.attackTimer   = freshState.attackTimer  ?? 0;

    // Transition screens: fade out menu, show game
    startScreen.classList.add('fade-out');
    startScreen.addEventListener('transitionend', () => {
      startScreen.classList.add('hidden');
      gameScreen.classList.remove('hidden');
    }, { once: true });

    // First render
    this.render();
  }

  // --- PAUSED (placeholder) -----------------------------------------------
  pauseMenuUpdate() {
    alert('Game paused – resume coming soon!');
  }

  // --- GAME_OVER ----------------------------------------------------------
  gameOverUpdate() {
    // Return to the main menu (the game-over modal is handled by ui.js)
    this.changeState("MAIN_MENU");
  }

  // --- WIN ----------------------------------------------------------------
  winUpdate() {
    // Return to the main menu (the win modal is handled by ui.js)
    this.changeState("MAIN_MENU");
  }


  // =====================================================================
  //  Rendering & CPU turns  –  helper methods used during GAMEPLAY
  // =====================================================================

  render() {
    renderGame(this._gameData, callbacks);
  }

  checkAndRunCPUTurns() {
    if (this._gameData.currentPlayer !== 0 && !this._gameData.gameover) {
      this.runCPUTurns();
    }
  }

  async runCPUTurns() {
    while (this._gameData.currentPlayer !== 0 && !this._gameData.gameover) {
      const currentCPU = this._gameData.currentPlayer;
      await executeCPUTurn(this._gameData, currentCPU, () => this.render());
      this.render();
    }
  }
}


// ==========================================================================
// Create the single Game instance  –  pseudocode "GLOBAL Game"
// ==========================================================================
const game = new Game();


// ==========================================================================
// CALLBACKS  –  connect UI actions to game logic
// ==========================================================================
// The callbacks object is passed to renderGame(). When the player clicks
// a card, draws, places a viltrumite, etc., the UI calls the matching callback.
// ==========================================================================

const callbacks = {

  onPlayCard(cardIndex) {
    const state = game._gameData;
    const card = state.players[0].hand[cardIndex];
    if (!card) return;

    switch (card.type) {

      case 'skip':
        playSkip(state, 0, cardIndex);
        game.render();
        game.checkAndRunCPUTurns();
        break;

      case 'attack':
        playAttack(state, 0, cardIndex);
        game.render();
        game.checkAndRunCPUTurns();
        break;

      case 'shuffle':
        playShuffle(state, 0, cardIndex);
        game.render();
        break;

      case 'see_future':
        playSeeTheFuture(state, 0, cardIndex);
        game.render();
        break;

      case 'favor':
        showTargetSelectionModal(
          state,
          'Favor',
          '\u{1F91D}',
          (targetId) => {
            const newCardIndex = state.players[0].hand.findIndex(c => c.id === card.id);
            if (newCardIndex === -1) return;
            playFavor(state, 0, newCardIndex, targetId);
            game.render();
          },
          () => { game.render(); }
        );
        break;

      case 'cat': {
        const matchingCats = state.players[0].hand.filter(
          c => c.type === 'cat' && c.name === card.name
        );

        if (matchingCats.length >= 2) {
          const validTargets = getValidTargets(state, 0);
          if (validTargets.length === 0) { game.render(); return; }

          showTargetSelectionModal(
            state,
            `Play ${card.name} Pair`,
            card.emoji,
            (targetId) => {
              showCatPairStealModal(
                state,
                targetId,
                () => { playCatPair(state, 0, card.name, targetId); game.render(); },
                () => { game.render(); }
              );
            },
            () => { game.render(); }
          );
        } else {
          playSingleCat(state, 0, cardIndex);
          game.render();
        }
        break;
      }
    }
  },

  onDrawCard() {
    const state = game._gameData;
    const result = drawCard(state, 0);
    game.render();

    if (result.result === 'drawn' && !result.continueTurn) {
      game.checkAndRunCPUTurns();
    } else if (result.result === 'exploded') {
      game.checkAndRunCPUTurns();
    }
  },

  onPlaceViltrumite(position) {
    const state = game._gameData;
    const result = placeExplodingViltrumite(state, position);
    game.render();

    if (!result.continueTurn) {
      game.checkAndRunCPUTurns();
    }
  },

  onSelectTarget(targetId) {
    // Handled by the modal callbacks in onPlayCard
  },

  onGiveFavorCard(cardIndex) {
    const state = game._gameData;
    resolveFavor(state, cardIndex);
    game.render();
  },

  onDismissModal() {
    const state = game._gameData;
    game.render();
    if (state.currentPlayer !== 0) {
      game.checkAndRunCPUTurns();
    }
  },

  // "New Game" from the game-over modal → return to MAIN_MENU
  onNewGame() {
    game.changeState("MAIN_MENU");
  },

  onCancelTargetSelection() {
    game.render();
  }
};


// ==========================================================================
// Wire up start-screen buttons
// ==========================================================================
// PLAY   → changeState("GAMEPLAY")  → creates cards & shows game
// SETTINGS / EXIT → placeholders for now
// ==========================================================================

document.getElementById('play-btn').addEventListener('click', () => {
  game.changeState("GAMEPLAY");
});

document.getElementById('settings-btn').addEventListener('click', () => {
  alert('Settings coming soon!');
});

document.getElementById('exit-btn').addEventListener('click', () => {
  alert('Thanks for playing!');
});

// The game starts in MAIN_MENU (set by the constructor).
// The start screen is already visible in the HTML, so no initial update needed.
