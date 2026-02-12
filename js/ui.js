/**
 * ui.js - User interface rendering for Exploding Kittens
 *
 * This module is responsible for turning the game state into visible
 * elements on the screen. It follows a simple pattern:
 *
 *   1. Read the current game state
 *   2. Update every part of the page to reflect that state
 *
 * The main function, renderGame(state, callbacks), is called every time
 * the state changes. It does NOT store any state itself - the game state
 * object from game.js is the single source of truth.
 *
 * We use document.createElement() throughout instead of innerHTML strings.
 * This is safer (no risk of XSS injection) and gives us direct references
 * to each element for attaching event listeners.
 */

import { CARD_TYPES } from './cards.js';

// ============================================================================
// Helper: clearElement(el) - remove all children from a DOM element
// ============================================================================
// We use this before rebuilding sections of the page. The while loop is
// efficient and works in all browsers.

function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

// ============================================================================
// Helper: createElement(tag, classNames, textContent) - shorthand builder
// ============================================================================
// Creating elements with classes and text is very common, so this helper
// saves us writing three lines every time.

function createElement(tag, classNames = '', textContent = '') {
  const el = document.createElement(tag);
  if (classNames) {
    // Support space-separated class names like "modal-button primary"
    classNames.split(' ').forEach(cls => {
      if (cls) el.classList.add(cls);
    });
  }
  if (textContent) {
    el.textContent = textContent;
  }
  return el;
}

// ============================================================================
// renderGame(state, callbacks) - main render function
// ============================================================================
// This is called every time the game state changes. It updates all visible
// parts of the page to match the current state. The callbacks object
// contains functions that connect UI actions back to the game logic.

function renderGame(state, callbacks) {
  renderHeader(state);
  renderCPUPlayers(state);
  renderStatusBanner(state);
  renderPiles(state);
  renderKittenPlacement(state, callbacks);
  renderPlayerSidebar(state, callbacks);
  renderModals(state, callbacks);
}

// ============================================================================
// 1. HEADER - Turn counter and current player name
// ============================================================================

function renderHeader(state) {
  // Update the turn counter pill
  const turnCounter = document.getElementById('turn-counter');
  turnCounter.textContent = `Turn ${state.turnNumber}`;
  turnCounter.className = 'turn-counter';

  // Update the current player indicator
  const playerName = document.getElementById('current-player-name');
  playerName.className = 'current-player-indicator';

  if (state.gameover) {
    playerName.textContent = 'Game Over!';
  } else if (state.currentPlayer === 0) {
    playerName.textContent = 'YOUR TURN!';
    playerName.style.color = '#22c55e';
  } else {
    const cpuName = state.players[state.currentPlayer].name;
    playerName.textContent = `${cpuName} is thinking...`;
    playerName.style.color = '#ffffff';
  }
}

// ============================================================================
// 2. CPU PLAYERS SIDEBAR - Show each CPU player's status
// ============================================================================

function renderCPUPlayers(state) {
  const list = document.getElementById('cpu-players-list');
  clearElement(list);

  // Loop through CPU players (IDs 1, 2, 3)
  for (let i = 1; i <= 3; i++) {
    const player = state.players[i];
    const card = createElement('div', 'cpu-player-card');

    // Highlight the active player's card
    if (state.currentPlayer === i && !player.isEliminated) {
      card.classList.add('active');
    }

    // Dim eliminated players
    if (player.isEliminated) {
      card.classList.add('eliminated');
    }

    // Player name row
    const nameDiv = createElement('div', 'player-name');
    nameDiv.textContent = `${player.name}`;
    card.appendChild(nameDiv);

    // Info row: card count + status badge
    const infoDiv = createElement('div', 'player-info');

    const cardCount = createElement('span', '', `🃏 ${player.hand.length} cards`);
    infoDiv.appendChild(cardCount);

    // Status badge (ALIVE or ELIMINATED)
    const badge = createElement('span', 'status-badge');
    if (player.isEliminated) {
      badge.classList.add('eliminated');
      badge.textContent = 'ELIMINATED';
    } else {
      badge.classList.add('alive');
      badge.textContent = 'ALIVE';
    }
    infoDiv.appendChild(badge);

    card.appendChild(infoDiv);

    // Show action text when this CPU is active
    if (state.pendingPlayer === i && state.pendingExplodingKitten) {
      // CPU is deciding where to place a defused Exploding Kitten
      const placing = createElement('div', 'thinking-text', 'PLACING KITTEN...');
      card.appendChild(placing);
    } else if (state.currentPlayer === i && !player.isEliminated) {
      // CPU is thinking about their next move
      const thinking = createElement('div', 'thinking-text', 'THINKING...');
      card.appendChild(thinking);
    }

    list.appendChild(card);
  }
}

// ============================================================================
// 3. STATUS BANNER - Contextual game messages
// ============================================================================

function renderStatusBanner(state) {
  const banner = document.getElementById('status-banner');
  clearElement(banner);
  banner.className = '';

  const humanPlayer = state.players[0];

  // Priority 1: Human is placing a defused Exploding Kitten
  if (state.pendingExplodingKitten && state.pendingPlayer === 0) {
    banner.className = 'status-banner defuse';
    banner.textContent = 'You defused it! Choose where to place the Exploding Kitten...';
    return;
  }

  // Priority 2: A CPU is placing a defused Exploding Kitten
  if (state.pendingExplodingKitten && state.pendingPlayer !== null && state.pendingPlayer !== 0) {
    const cpuName = state.players[state.pendingPlayer].name;
    banner.className = 'status-banner defuse';
    banner.textContent = `${cpuName} defused it! They're placing the kitten...`;
    return;
  }

  // Priority 3: Human must give a card due to Favor
  if (state.favorTarget === 0 && state.pendingFavor !== null) {
    const requesterName = state.players[state.pendingFavor].name;
    banner.className = 'status-banner favor';
    banner.textContent = `Choose a card to give to ${requesterName}`;
    return;
  }

  // Priority 4: Human is eliminated
  if (humanPlayer.isEliminated) {
    banner.className = 'status-banner elimination';
    banner.textContent = "You've been eliminated! \u{1F480}";
    return;
  }

  // Priority 5: It's the human's turn
  if (state.currentPlayer === 0 && !state.gameover) {
    banner.className = 'status-banner neutral';
    banner.textContent = 'Your turn - play a card or draw';
    return;
  }

  // Priority 6: A CPU is playing
  if (!state.gameover && state.currentPlayer !== 0) {
    const cpuName = state.players[state.currentPlayer].name;
    banner.className = 'status-banner neutral';
    banner.textContent = `${cpuName} is thinking...`;
    return;
  }

  // No status to show (e.g. game over - the modal handles that)
  banner.className = '';
}

// ============================================================================
// 4. DRAW & DISCARD PILES
// ============================================================================

function renderPiles(state) {
  // Update draw pile count
  const drawCount = document.getElementById('draw-count');
  drawCount.textContent = state.deck.length;

  // Update discard pile
  const discardEmoji = document.getElementById('discard-emoji');
  const discardName = document.getElementById('discard-name');
  const discardCount = document.getElementById('discard-count');

  if (state.discardPile.length > 0) {
    // Show the most recently played card on top
    const topCard = state.discardPile[state.discardPile.length - 1];
    discardEmoji.textContent = topCard.emoji;
    discardName.textContent = topCard.name;
    discardCount.textContent = state.discardPile.length;
  } else {
    // Empty discard pile
    discardEmoji.textContent = '\u{1F4C2}';
    discardName.textContent = '';
    discardCount.textContent = '0';
  }
}

// ============================================================================
// 5. KITTEN PLACEMENT - Buttons for placing a defused Exploding Kitten
// ============================================================================

function renderKittenPlacement(state, callbacks) {
  const placement = document.getElementById('kitten-placement');
  const buttons = document.getElementById('placement-buttons');

  // Only show when the human player needs to place an Exploding Kitten
  if (state.pendingExplodingKitten && state.pendingPlayer === 0) {
    placement.classList.remove('hidden');
    placement.className = 'kitten-placement-bar';
    clearElement(buttons);
    buttons.className = 'kitten-placement-buttons';

    // Top position - the next player draws it immediately (evil move!)
    const topBtn = createElement('button', '', '\u{1F51D} TOP (EVIL!)');
    topBtn.addEventListener('click', () => callbacks.onPlaceKitten(0));
    buttons.appendChild(topBtn);

    // Middle position - somewhere in the middle of the deck
    const midPosition = Math.floor(state.deck.length / 2);
    const midBtn = createElement('button', '', '\u{2195}\u{FE0F} MIDDLE');
    midBtn.addEventListener('click', () => callbacks.onPlaceKitten(midPosition));
    buttons.appendChild(midBtn);

    // Bottom position - safe, drawn last
    const bottomBtn = createElement('button', '', '\u{2B07}\u{FE0F} BOTTOM (SAFE)');
    bottomBtn.addEventListener('click', () => callbacks.onPlaceKitten(state.deck.length));
    buttons.appendChild(bottomBtn);
  } else {
    placement.className = 'hidden';
  }
}

// ============================================================================
// 6. PLAYER HAND SIDEBAR - Cards, draw button, turn info
// ============================================================================

function renderPlayerSidebar(state, callbacks) {
  const humanPlayer = state.players[0];

  // --- Hand count ---
  const handCount = document.getElementById('hand-count');
  handCount.textContent = `(${humanPlayer.hand.length} cards)`;

  // --- Player status (ELIMINATED if dead) ---
  const playerStatus = document.getElementById('player-status');
  if (humanPlayer.isEliminated) {
    playerStatus.textContent = 'ELIMINATED';
    playerStatus.className = 'status-badge eliminated';
  } else {
    playerStatus.textContent = '';
    playerStatus.className = '';
  }

  // --- Turn indicator pill ---
  const turnIndicator = document.getElementById('turn-indicator');
  clearElement(turnIndicator);
  if (state.currentPlayer === 0 && !humanPlayer.isEliminated && !state.gameover) {
    turnIndicator.className = 'turn-indicator your-turn';
    turnIndicator.textContent = 'YOUR TURN! \u{1F3AE}';
  } else {
    turnIndicator.className = 'turn-indicator waiting';
    turnIndicator.textContent = 'WAITING...';
  }

  // --- Draw button ---
  const drawButton = document.getElementById('draw-button');
  drawButton.textContent = `DRAW CARD \u{1F0CF} (${state.deck.length} left)`;
  drawButton.className = 'draw-button';

  // Determine if there are any pending actions blocking the draw
  const hasPendingAction =
    (state.pendingExplodingKitten && state.pendingPlayer === 0) ||
    state.seeTheFutureCards !== null ||
    (state.favorTarget === 0 && state.pendingFavor !== null);

  // Enable only when it's the human's turn and no pending actions
  const canDraw = state.currentPlayer === 0 &&
    !humanPlayer.isEliminated &&
    !state.gameover &&
    !hasPendingAction;

  drawButton.disabled = !canDraw;

  // Replace the button to remove old event listeners cleanly
  const newDrawButton = drawButton.cloneNode(true);
  drawButton.parentNode.replaceChild(newDrawButton, drawButton);
  if (canDraw) {
    newDrawButton.addEventListener('click', () => callbacks.onDrawCard());
  }

  // --- Player hand grid ---
  renderPlayerHand(state, callbacks);

  // --- Favor banner ---
  renderFavorBanner(state);

  // --- Help text ---
  renderHelpText(state);
}

// ============================================================================
// 6e. Player Hand Grid - Render each card as a clickable tile
// ============================================================================

function renderPlayerHand(state, callbacks) {
  const handContainer = document.getElementById('player-hand');
  clearElement(handContainer);

  const humanPlayer = state.players[0];
  const grid = createElement('div', 'cards-grid');

  // Check if we're in "favor give" mode (human must give a card)
  const isFavorMode = state.favorTarget === 0 && state.pendingFavor !== null;

  if (isFavorMode) {
    grid.classList.add('favor-mode');
  }

  // Determine if there are pending actions blocking normal play
  const hasPendingAction =
    (state.pendingExplodingKitten && state.pendingPlayer === 0) ||
    state.seeTheFutureCards !== null ||
    (state.favorTarget === 0 && state.pendingFavor !== null);

  // Check if the human can play cards right now
  const isHumanTurn = state.currentPlayer === 0 &&
    !humanPlayer.isEliminated &&
    !state.gameover &&
    !hasPendingAction;

  // Count how many of each cat card the human has (for pair detection)
  const catCounts = {};
  humanPlayer.hand.forEach(card => {
    if (card.type === 'cat') {
      catCounts[card.name] = (catCounts[card.name] || 0) + 1;
    }
  });

  // Build a tile for each card in the hand
  humanPlayer.hand.forEach((card, cardIndex) => {
    const tile = createElement('div', 'card-tile');

    // Card emoji (large icon)
    const emojiSpan = createElement('span', 'card-emoji', card.emoji);
    tile.appendChild(emojiSpan);

    // Card name
    const nameSpan = createElement('span', 'card-name', card.name);
    tile.appendChild(nameSpan);

    // Card type description
    const typeSpan = createElement('span', 'card-type', card.description);
    tile.appendChild(typeSpan);

    // Determine the card's state and action based on game context
    let actionText = '';

    if (isFavorMode) {
      // --- Favor give mode: every card is clickable ---
      tile.classList.add('playable');
      actionText = 'Give card';
      tile.addEventListener('click', () => callbacks.onGiveFavorCard(cardIndex));

    } else if (isHumanTurn) {
      // --- Normal play mode: depends on card type ---
      switch (card.type) {
        case 'exploding':
          tile.classList.add('non-playable', 'exploding-kitten');
          actionText = 'DANGER!';
          break;

        case 'defuse':
          tile.classList.add('non-playable', 'defuse');
          actionText = 'SAFETY';
          break;

        case 'skip':
          tile.classList.add('playable');
          actionText = 'Play';
          tile.addEventListener('click', () => callbacks.onPlayCard(cardIndex));
          break;

        case 'shuffle':
          tile.classList.add('playable');
          actionText = 'Play';
          tile.addEventListener('click', () => callbacks.onPlayCard(cardIndex));
          break;

        case 'attack':
          tile.classList.add('playable');
          actionText = 'Play';
          tile.addEventListener('click', () => callbacks.onPlayCard(cardIndex));
          break;

        case 'see_future':
          tile.classList.add('playable');
          actionText = 'See future';
          tile.addEventListener('click', () => callbacks.onPlayCard(cardIndex));
          break;

        case 'favor':
          tile.classList.add('playable');
          actionText = 'Choose target';
          tile.addEventListener('click', () => callbacks.onPlayCard(cardIndex));
          break;

        case 'cat':
          // Cat cards need a matching pair to be useful
          if (catCounts[card.name] >= 2) {
            tile.classList.add('cat-pair', 'playable');
            actionText = 'Play pair';
            // Add a "PAIR!" label
            const pairLabel = createElement('span', 'card-action', 'PAIR!');
            pairLabel.style.color = 'var(--color-warning)';
            pairLabel.style.fontWeight = '700';
            tile.appendChild(pairLabel);
            tile.addEventListener('click', () => callbacks.onPlayCard(cardIndex));
          } else {
            tile.classList.add('non-playable');
            actionText = 'Need pair';
          }
          break;

        default:
          tile.classList.add('non-playable');
          actionText = '';
      }
    } else {
      // --- Not the human's turn: all cards are non-playable ---
      tile.classList.add('non-playable');
    }

    // Add the action label at the bottom of the tile
    const actionSpan = createElement('span', 'card-action', actionText);
    tile.appendChild(actionSpan);

    grid.appendChild(tile);
  });

  handContainer.appendChild(grid);
}

// ============================================================================
// 6f. Favor Banner - Shown when the human must give a card
// ============================================================================

function renderFavorBanner(state) {
  const banner = document.getElementById('favor-banner');
  clearElement(banner);

  if (state.favorTarget === 0 && state.pendingFavor !== null) {
    banner.classList.remove('hidden');
    banner.className = 'favor-instruction';
    const requesterName = state.players[state.pendingFavor].name;
    banner.textContent = `\u{1F91D} GIVE A CARD - Click any card to give to ${requesterName}`;
  } else {
    banner.className = 'hidden';
  }
}

// ============================================================================
// 6g. Help Text - Context-dependent instructions
// ============================================================================

function renderHelpText(state) {
  const helpText = document.getElementById('help-text');

  if (state.gameover) {
    helpText.textContent = 'Game over! Check the results above.';
  } else if (state.favorTarget === 0 && state.pendingFavor !== null) {
    const requesterName = state.players[state.pendingFavor].name;
    helpText.textContent = `You must give a card to ${requesterName}.`;
  } else if (state.pendingExplodingKitten && state.pendingPlayer === 0) {
    helpText.textContent = 'Choose where to place the Exploding Kitten in the deck.';
  } else if (state.seeTheFutureCards) {
    helpText.textContent = 'Viewing the top 3 cards of the deck...';
  } else if (state.currentPlayer === 0) {
    helpText.textContent = 'Play cards or draw to end your turn.';
  } else if (state.players[0].isEliminated) {
    helpText.textContent = 'You have been eliminated. Watch the rest of the game!';
  } else {
    const cpuName = state.players[state.currentPlayer].name;
    helpText.textContent = `Waiting for ${cpuName}...`;
  }
}

// ============================================================================
// 7. MODALS - Game over, attack notification, see the future
// ============================================================================

function renderModals(state, callbacks) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  // --- Game Over modal (highest priority) ---
  if (state.gameover) {
    overlay.classList.remove('hidden');
    overlay.className = 'modal-overlay';
    clearElement(content);
    content.className = 'modal-content game-over';

    const title = createElement('h2', '', '\u{1F389}\u{1F38A} Game Over! \u{1F38A}\u{1F389}');
    content.appendChild(title);

    const winner = createElement('p', '', `\u{1F3C6} ${state.gameover.winnerName} wins!`);
    winner.style.fontSize = '1.3rem';
    content.appendChild(winner);

    const reason = createElement('p', '', state.gameover.reason);
    content.appendChild(reason);

    const buttonRow = createElement('div', 'modal-buttons');
    const newGameBtn = createElement('button', 'modal-button primary', 'Start New Game');
    newGameBtn.addEventListener('click', () => callbacks.onNewGame());
    buttonRow.appendChild(newGameBtn);
    content.appendChild(buttonRow);
    return;
  }

  // --- Attack Notification modal ---
  if (state.attackNotification) {
    overlay.classList.remove('hidden');
    overlay.className = 'modal-overlay';
    clearElement(content);
    content.className = 'modal-content attack';

    // Bouncing emoji header
    const emojiHeader = createElement('p', '', '\u{2694}\u{FE0F}\u{1F4A5}');
    emojiHeader.style.fontSize = '3rem';
    emojiHeader.style.textAlign = 'center';
    emojiHeader.style.animation = 'bounce 1s ease-in-out infinite';
    content.appendChild(emojiHeader);

    const title = createElement('h2', '', "YOU'VE BEEN ATTACKED!");
    title.style.textAlign = 'center';
    content.appendChild(title);

    // Random funny message
    const funnyMessages = [
      "Looks like someone doesn't like you very much!",
      "That's gonna leave a mark!",
      "Time to sweat! Good luck not exploding!",
      "The kittens are getting restless...",
      "Hope you have a good hand! (You'll need it)",
      "Plot twist: it's always your turn now!",
      "Somebody call the kitten police!",
      "This is what happens when you trust a cat..."
    ];
    const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
    const messagePara = createElement('p', '', randomMessage);
    messagePara.style.textAlign = 'center';
    content.appendChild(messagePara);

    // Damage info
    const damage = createElement('p', '', `Damage: Take ${state.attackNotification.remainingTurns} turns`);
    damage.style.textAlign = 'center';
    damage.style.fontWeight = '700';
    damage.style.fontSize = '1.1rem';
    content.appendChild(damage);

    // Dismiss buttons
    const buttonRow = createElement('div', 'modal-buttons');
    buttonRow.style.justifyContent = 'center';

    const acceptBtn = createElement('button', 'modal-button primary', "FINE, I'LL TAKE IT! \u{1F624}");
    acceptBtn.addEventListener('click', () => {
      state.attackNotification = null;
      callbacks.onDismissModal();
    });
    buttonRow.appendChild(acceptBtn);

    const unfairBtn = createElement('button', 'modal-button secondary', 'THIS IS UNFAIR! \u{1F63E}');
    unfairBtn.addEventListener('click', () => {
      state.attackNotification = null;
      callbacks.onDismissModal();
    });
    buttonRow.appendChild(unfairBtn);

    content.appendChild(buttonRow);
    return;
  }

  // --- See the Future modal ---
  if (state.seeTheFutureCards) {
    overlay.classList.remove('hidden');
    overlay.className = 'modal-overlay';
    clearElement(content);
    content.className = 'modal-content';

    const title = createElement('h2', '', '\u{1F52E} See the Future');
    content.appendChild(title);

    const helper = createElement('p', '', 'The first card shown will be drawn next...');
    content.appendChild(helper);

    // List the top 3 cards
    const cardList = createElement('div', 'modal-list');

    state.seeTheFutureCards.forEach((card, index) => {
      const item = createElement('div', 'modal-list-item');
      item.style.cursor = 'default';

      // Highlight exploding kittens in red, defuse in green
      if (card.type === 'exploding') {
        item.style.background = 'rgba(239, 68, 68, 0.15)';
        item.style.borderLeft = '4px solid var(--color-danger)';
      } else if (card.type === 'defuse') {
        item.style.background = 'rgba(34, 197, 94, 0.15)';
        item.style.borderLeft = '4px solid var(--color-success)';
      }

      item.textContent = `${index + 1}. ${card.emoji} ${card.name} - ${card.description}`;
      cardList.appendChild(item);
    });

    content.appendChild(cardList);

    // Dismiss button
    const buttonRow = createElement('div', 'modal-buttons');
    const gotItBtn = createElement('button', 'modal-button primary', 'Got it! \u{1F44D}');
    gotItBtn.addEventListener('click', () => {
      state.seeTheFutureCards = null;
      state.seeTheFuturePlayer = null;
      callbacks.onDismissModal();
    });
    buttonRow.appendChild(gotItBtn);
    content.appendChild(buttonRow);
    return;
  }

  // --- No modal active: hide the overlay ---
  overlay.className = 'modal-overlay hidden';
}

// ============================================================================
// showTargetSelectionModal(state, title, emoji, onSelect, onCancel)
// ============================================================================
// Displays a modal listing alive players that can be targeted.
// Used for Favor and Cat Pair actions where the human must pick a target.

function showTargetSelectionModal(state, title, emoji, onSelect, onCancel) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');

  overlay.classList.remove('hidden');
  overlay.className = 'modal-overlay';
  clearElement(content);
  content.className = 'modal-content';

  // Title with emoji
  const heading = createElement('h2', '', `${emoji} ${title}`);
  content.appendChild(heading);

  const helper = createElement('p', '', 'Choose a player to target:');
  content.appendChild(helper);

  // List of alive players (excluding the human)
  const playerList = createElement('div', 'modal-list');

  for (let i = 1; i <= 3; i++) {
    const player = state.players[i];

    // Only show alive players who have cards
    if (player.isEliminated || player.hand.length === 0) {
      continue;
    }

    const item = createElement('div', 'modal-list-item');
    item.textContent = `\u{1F916} ${player.name} (${player.hand.length} cards)`;
    item.addEventListener('click', () => onSelect(player.id));
    playerList.appendChild(item);
  }

  content.appendChild(playerList);

  // Cancel button
  const buttonRow = createElement('div', 'modal-buttons');
  const cancelBtn = createElement('button', 'modal-button secondary', 'Cancel');
  cancelBtn.addEventListener('click', () => onCancel());
  buttonRow.appendChild(cancelBtn);
  content.appendChild(buttonRow);
}

// ============================================================================
// showCatPairStealModal(state, targetId, onSelect, onCancel)
// ============================================================================
// Shows face-down card backs for the target player's hand. The human clicks
// one to "steal" it. The actual stolen card is random (handled by game logic),
// so this is purely visual - it just adds drama and fun!

function showCatPairStealModal(state, targetId, onSelect, onCancel) {
  const overlay = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  const target = state.players[targetId];

  overlay.classList.remove('hidden');
  overlay.className = 'modal-overlay';
  clearElement(content);
  content.className = 'modal-content';

  const heading = createElement('h2', '', `Steal from ${target.name}!`);
  content.appendChild(heading);

  const helper = createElement('p', '', 'Pick a card (face down - it\'s a lucky dip!):');
  content.appendChild(helper);

  // Grid of face-down cards
  const cardGrid = createElement('div', 'cards-grid');
  cardGrid.style.marginBottom = '16px';

  for (let i = 0; i < target.hand.length; i++) {
    const cardBack = createElement('div', 'card-tile playable');
    cardBack.style.cursor = 'pointer';

    const backEmoji = createElement('span', 'card-emoji', '\u{1F0A0}');
    cardBack.appendChild(backEmoji);

    const backLabel = createElement('span', 'card-name', `Card ${i + 1}`);
    cardBack.appendChild(backLabel);

    cardBack.addEventListener('click', () => onSelect(i));
    cardGrid.appendChild(cardBack);
  }

  content.appendChild(cardGrid);

  // Buttons: Back and Cancel
  const buttonRow = createElement('div', 'modal-buttons');

  const backBtn = createElement('button', 'modal-button secondary', 'Back');
  backBtn.addEventListener('click', () => onCancel());
  buttonRow.appendChild(backBtn);

  const cancelBtn = createElement('button', 'modal-button secondary', 'Cancel');
  cancelBtn.addEventListener('click', () => onCancel());
  buttonRow.appendChild(cancelBtn);

  content.appendChild(buttonRow);
}

// ============================================================================
// Exports
// ============================================================================

export {
  renderGame,
  showTargetSelectionModal,
  showCatPairStealModal
};
