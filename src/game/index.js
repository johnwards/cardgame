/**
 * Exploding Kittens Game - Phase C Implementation
 * 
 * Following boardgame.io tutorial patterns exactly.
 * Phase A.1: Expanded to 4-player game structure (1 human + 3 CPU) ✅
 * Phase A.2: Implemented proper card system with correct deck composition ✅
 * Phase B.1: Added basic card playing move (playCard) ✅
 * Phase B.2: Implemented exploding kitten detection and defuse mechanics ✅
 * Phase C.1: Added win condition logic (endIf) ✅
 * Phase C.2: Implemented basic CPU AI logic (ai.enumerate) ✅
 */

import { INVALID_MOVE } from 'boardgame.io/core';
import { setupGameDeck, CARD_TYPES, findCatPairs } from '../constants/cards.js';

console.log('Game file loading...');

const ExplodingKittensGame = {
  name: 'exploding-kittens-phase-c',

  setup: ({ ctx, random }) => {
    console.log('Phase A Setup called with numPlayers:', ctx.numPlayers);

    // Force 4 players for Phase A (1 human + 3 CPU)
    const numPlayers = 4;

    // Use proper card system from constants
    const { dealtCards, finalDeck } = setupGameDeck(numPlayers, random);

    // Create 4 players (Player 0 = human, Players 1-3 = CPU)
    const players = {};
    for (let i = 0; i < numPlayers; i++) {
      players[i] = {
        id: i,
        name: i === 0 ? 'You' : `CPU ${i}`,
        hand: dealtCards[i], // Each player gets their dealt cards (1 defuse + 7 regular)
        isEliminated: false,
        isCPU: i !== 0
      };
    }

    const gameState = {
      players,
      deck: finalDeck, // Remaining deck with 4 defuse + 8 exploding + remaining action cards
      discardPile: [],
      pendingExplodingKitten: null, // For defused exploding kittens awaiting placement
      pendingPlayer: null, // Player who needs to place the exploding kitten
      turnsRemaining: {}, // Track extra turns from Attack cards
      pendingFavor: null, // Track pending favor requests
      favorTarget: null   // Target player for favor
    };

    console.log('Phase C Setup complete:');
    console.log('- Players:', numPlayers);
    console.log('- Deck remaining:', finalDeck.length);
    console.log('- Each player starts with 8 cards (1 defuse + 7 regular)');
    console.log('- Phase C features: CPU AI logic, complete win conditions, automatic CPU turns');

    return gameState;
  },

  moves: {
    playCard: ({ G, playerID, events, random }, cardIndex, targetPlayerID) => {
      console.log('=== PLAYCARD MOVE CALLED ===');
      console.log('playerID:', playerID, 'cardIndex:', cardIndex, 'targetPlayerID:', targetPlayerID);

      // Validate card index
      if (cardIndex < 0 || cardIndex >= G.players[playerID].hand.length) {
        console.log('Invalid card index');
        return INVALID_MOVE;
      }

      const card = G.players[playerID].hand[cardIndex];
      console.log('Attempting to play card:', card.name, 'type:', card.type);

      // Remove card from hand and add to discard pile
      G.players[playerID].hand.splice(cardIndex, 1);
      G.discardPile.push(card);

      // Handle card effects based on type
      switch (card.type) {
        case CARD_TYPES.SKIP:
          console.log('Skip card played - ending turn without drawing');
          // Check if player has multiple turns from attack
          if (G.turnsRemaining[playerID] && G.turnsRemaining[playerID] > 1) {
            G.turnsRemaining[playerID]--;
            console.log('Player', playerID, 'skipped one turn, has', G.turnsRemaining[playerID], 'turns remaining');
            // Don't end turn, player continues
          } else {
            // Reset turns and end turn normally
            G.turnsRemaining[playerID] = 1;
            events.endTurn();
          }
          break;

        case CARD_TYPES.SHUFFLE:
          console.log('Shuffle card played - shuffling deck');
          G.deck = random.Shuffle([...G.deck]);
          break;

        case CARD_TYPES.ATTACK: {
          console.log('Attack card played - forcing next player to take 2 turns');
          const nextPlayerIndex = (parseInt(playerID) + 1) % Object.keys(G.players).length;
          let nextPlayer = nextPlayerIndex;
          // Skip eliminated players
          while (G.players[nextPlayer]?.isEliminated) {
            nextPlayer = (nextPlayer + 1) % Object.keys(G.players).length;
          }
          G.turnsRemaining[nextPlayer] = (G.turnsRemaining[nextPlayer] || 1) + 1;
          console.log('Next player', nextPlayer, 'now has', G.turnsRemaining[nextPlayer], 'turns');
          events.endTurn();
          break;
        }

        case CARD_TYPES.FAVOR:
          if (targetPlayerID === undefined || targetPlayerID === playerID) {
            console.log('Favor card requires target player selection');
            return INVALID_MOVE;
          }
          if (G.players[targetPlayerID]?.isEliminated) {
            console.log('Cannot favor eliminated player');
            return INVALID_MOVE;
          }
          if (G.players[targetPlayerID].hand.length === 0) {
            console.log('Target player has no cards');
            return INVALID_MOVE;
          }
          console.log('Favor card played - requesting card from player', targetPlayerID);
          
          // For CPU players, immediately give a random card
          if (G.players[targetPlayerID].isCPU) {
            console.log('Target is CPU, immediately giving random card');
            const targetHand = G.players[targetPlayerID].hand;
            const randomIndex = Math.floor(Math.random() * targetHand.length);
            const givenCard = targetHand.splice(randomIndex, 1)[0];
            G.players[playerID].hand.push(givenCard);
            console.log('CPU gave card:', givenCard.name);
          } else {
            // For human players, set up pending favor state
            G.pendingFavor = playerID;
            G.favorTarget = targetPlayerID;
          }
          break;

        case CARD_TYPES.CAT:
          console.log('Cat card played - but no special effect for single cat');
          break;

        default:
          console.log('Unknown card type:', card.type);
          break;
      }

      console.log('Card played successfully');
      console.log('=== PLAYCARD COMPLETE ===');
    },

    drawCard: ({ G, playerID, events }) => {
      console.log('=== DRAWCARD MOVE CALLED ===');
      console.log('playerID:', playerID);

      if (G.deck.length === 0) {
        console.log('Deck empty, invalid move');
        return INVALID_MOVE;
      }

      const card = G.deck.pop();
      console.log('Drew card:', card.name, 'type:', card.type);

      // Check if it's an exploding kitten
      if (card.type === CARD_TYPES.EXPLODING) {
        console.log('EXPLODING KITTEN DRAWN!');

        // Check for defuse card
        const defuseIndex = G.players[playerID].hand.findIndex(
          c => c.type === CARD_TYPES.DEFUSE
        );

        if (defuseIndex !== -1) {
          console.log('🛡️ Player has defuse card at index:', defuseIndex);
          console.log('🛡️ Defuse card details:', G.players[playerID].hand[defuseIndex]);
          console.log('🛡️ Player hand before defuse:', G.players[playerID].hand.length, 'cards');
          console.log('🛡️ Discard pile before defuse:', G.discardPile.length, 'cards');

          // Player has defuse - remove it and discard it
          const defuseCard = G.players[playerID].hand.splice(defuseIndex, 1)[0];
          G.discardPile.push(defuseCard);

          console.log('🛡️ DEFUSE CARD CONSUMED!');
          console.log('🛡️ Player hand after defuse:', G.players[playerID].hand.length, 'cards');
          console.log('🛡️ Discard pile after defuse:', G.discardPile.length, 'cards');
          console.log('🛡️ Defused card moved to discard:', defuseCard.name);

          // Set state for exploding kitten placement
          G.pendingExplodingKitten = card;
          G.pendingPlayer = playerID;

          console.log('🛡️ Defuse used, awaiting exploding kitten placement');

          // Don't end turn - wait for placement
          return;
        } else {
          console.log('💀 Player has no defuse card - ELIMINATED!');
          console.log('💀 Player', playerID, 'hand contents:', G.players[playerID].hand.map(c => c.type));
          console.log('💀 Player elimination status before:', G.players[playerID].isEliminated);

          // Player has no defuse - eliminate them
          G.players[playerID].isEliminated = true;

          console.log('💀 PLAYER ELIMINATED!');
          console.log('💀 Player', playerID, 'elimination status after:', G.players[playerID].isEliminated);
          console.log('💀 Player name:', G.players[playerID].name);

          // Don't add exploding kitten to hand - it exploded!

          // Check win condition
          const alivePlayers = Object.values(G.players).filter(p => !p.isEliminated);
          console.log('💀 Players remaining alive:', alivePlayers.length);
          console.log('💀 Alive players:', alivePlayers.map(p => p.name));

          if (alivePlayers.length === 1) {
            console.log('Game over - single winner!');
            // Game will end via endIf condition
          }

          // End turn after elimination
          console.log('Ending turn after player elimination');
          events.endTurn();
          return;
        }
      } else {
        // Regular card - add to hand
        G.players[playerID].hand.push(card);
        console.log('Regular card added to hand');
      }

      // Check if player has multiple turns from attack
      if (G.turnsRemaining[playerID] && G.turnsRemaining[playerID] > 1) {
        G.turnsRemaining[playerID]--;
        console.log('Player', playerID, 'has', G.turnsRemaining[playerID], 'turns remaining, not ending turn');
        // Don't end turn, player continues
        return;
      } else {
        // Reset turns and end turn normally
        G.turnsRemaining[playerID] = 1;
        console.log('Drawing card ends turn - passing to next player');
        events.endTurn();
      }

      console.log('=== DRAWCARD COMPLETE ===');
    },

    placeExplodingKitten: ({ G, playerID, events }, position) => {
      console.log('=== PLACE EXPLODING KITTEN MOVE CALLED ===');
      console.log('playerID:', playerID, 'position:', position);
      console.log('💣 Deck length before placement:', G.deck.length);
      console.log('💣 Deck top 3 cards before placement (next to draw first):', G.deck.slice(-3).map(c => c.name).reverse());

      if (!G.pendingExplodingKitten || G.pendingPlayer !== playerID) {
        console.log('No pending exploding kitten or wrong player');
        return INVALID_MOVE;
      }

      // Validate position (0 = top of deck, deck.length = bottom of deck)
      if (position < 0 || position > G.deck.length) {
        console.log('Invalid position:', position, 'deck length:', G.deck.length);
        return INVALID_MOVE;
      }

      // Calculate actual array position
      // Since deck.pop() takes from END of array, position 0 should be END of array
      let actualPosition;
      if (position === 0) {
        // Top of deck = end of array (next card to be drawn)
        actualPosition = G.deck.length;
      } else if (position === G.deck.length) {
        // Bottom of deck = beginning of array (last card to be drawn)
        actualPosition = 0;
      } else {
        // Middle positions need to be flipped
        actualPosition = G.deck.length - position;
      }

      console.log('💣 Requested position:', position, '(0=top, ' + G.deck.length + '=bottom)');
      console.log('💣 Actual array position:', actualPosition);

      // Insert at calculated position
      G.deck.splice(actualPosition, 0, G.pendingExplodingKitten);

      console.log('💣 EXPLODING KITTEN PLACED!');
      console.log('💣 Deck length after placement:', G.deck.length);
      console.log('💣 Deck top 3 cards after placement (next to draw first):', G.deck.slice(-3).map(c => c.name).reverse());
      console.log('💣 Card placed:', G.pendingExplodingKitten.name);
      console.log('💣 Note: Position 0 = top of deck = next card to be drawn = end of array');

      // Clear pending state
      G.pendingExplodingKitten = null;
      G.pendingPlayer = null;

      // Check if player has multiple turns from attack
      if (G.turnsRemaining[playerID] && G.turnsRemaining[playerID] > 1) {
        G.turnsRemaining[playerID]--;
        console.log('Player', playerID, 'placed exploding kitten, has', G.turnsRemaining[playerID], 'turns remaining');
        // Don't end turn, player continues
      } else {
        // Reset turns and end turn normally
        G.turnsRemaining[playerID] = 1;
        console.log('Exploding kitten placement ends turn - passing to next player');
        events.endTurn();
      }

      console.log('=== PLACE EXPLODING KITTEN COMPLETE ===');
    },

    giveFavorCard: ({ G, playerID }, cardIndex) => {
      console.log('=== GIVE FAVOR CARD MOVE CALLED ===');
      console.log('playerID:', playerID, 'cardIndex:', cardIndex);

      if (G.favorTarget !== playerID || !G.pendingFavor) {
        console.log('No pending favor for this player');
        return INVALID_MOVE;
      }

      if (cardIndex < 0 || cardIndex >= G.players[playerID].hand.length) {
        console.log('Invalid card index');
        return INVALID_MOVE;
      }

      const card = G.players[playerID].hand.splice(cardIndex, 1)[0];
      G.players[G.pendingFavor].hand.push(card);

      console.log('Favor completed - card given to player', G.pendingFavor);

      // Clear favor state
      G.pendingFavor = null;
      G.favorTarget = null;

      console.log('=== GIVE FAVOR CARD COMPLETE ===');
    },

    playCatPair: ({ G, playerID, random }, catName, targetPlayerID) => {
      console.log('=== PLAY CAT PAIR MOVE CALLED ===');
      console.log('playerID:', playerID, 'catName:', catName, 'targetPlayerID:', targetPlayerID);

      if (targetPlayerID === undefined || targetPlayerID === playerID) {
        console.log('Invalid target player');
        return INVALID_MOVE;
      }

      if (G.players[targetPlayerID]?.isEliminated) {
        console.log('Cannot target eliminated player');
        return INVALID_MOVE;
      }

      if (G.players[targetPlayerID].hand.length === 0) {
        console.log('Target player has no cards');
        return INVALID_MOVE;
      }

      // Find matching cat cards
      const catCards = G.players[playerID].hand.filter(
        card => card.type === CARD_TYPES.CAT && card.name === catName
      );

      if (catCards.length < 2) {
        console.log('Not enough matching cat cards');
        return INVALID_MOVE;
      }

      // Remove 2 cat cards from hand and discard them
      const usedCards = [];
      for (let i = 0; i < 2; i++) {
        const cardIndex = G.players[playerID].hand.findIndex(
          card => card.type === CARD_TYPES.CAT && card.name === catName
        );
        if (cardIndex !== -1) {
          usedCards.push(G.players[playerID].hand.splice(cardIndex, 1)[0]);
        }
      }

      G.discardPile.push(...usedCards);

      // Steal random card from target
      const targetHand = G.players[targetPlayerID].hand;
      const randomIndex = random.Die(targetHand.length) - 1; // Die returns 1-N, we need 0-N-1
      const stolenCard = targetHand.splice(randomIndex, 1)[0];
      G.players[playerID].hand.push(stolenCard);

      console.log('Cat pair played - stolen card:', stolenCard.name);
      console.log('=== PLAY CAT PAIR COMPLETE ===');
    }
  },

  turn: {
    // No minMoves or maxMoves - turns end explicitly via events.endTurn()
    // Players can play multiple cards, but drawing always ends the turn

    onBegin: ({ G, ctx, events }) => {
      // Skip eliminated players
      let currentPlayer = parseInt(ctx.currentPlayer);
      if (G.players[currentPlayer]?.isEliminated) {
        console.log('Skipping eliminated player:', currentPlayer);
        events.endTurn();
        return;
      }

      console.log('Turn begins for player', currentPlayer);
    }
  },

  endIf: ({ G }) => {
    const alivePlayers = Object.values(G.players).filter(p => !p.isEliminated);

    if (alivePlayers.length === 1) {
      console.log('Game over - single winner:', alivePlayers[0].name);
      return {
        winner: alivePlayers[0].id,
        winnerName: alivePlayers[0].name,
        reason: "Last player standing"
      };
    }

    if (G.deck.length === 0) {
      console.log('Game over - deck exhausted');
      return {
        winner: alivePlayers.map(p => p.id),
        winnerName: "All remaining players",
        reason: "Deck exhausted"
      };
    }

    return false;
  },

  // Phase C.2: Basic CPU AI Logic
  ai: {
    enumerate: (G, ctx) => {
      console.log('=== AI ENUMERATE CALLED ===');
      const playerID = ctx.currentPlayer;
      const moves = [];

      console.log('CPU player', playerID, 'is active, generating moves...');

      // Handle pending exploding kitten placement first
      if (G.pendingExplodingKitten && G.pendingPlayer === playerID) {
        console.log('CPU needs to place exploding kitten');
        const deckLength = G.deck.length;
        moves.push({ move: 'placeExplodingKitten', args: [0] });
        moves.push({ move: 'placeExplodingKitten', args: [Math.floor(deckLength / 3)] });
        moves.push({ move: 'placeExplodingKitten', args: [Math.floor(deckLength * 2 / 3)] });
        moves.push({ move: 'placeExplodingKitten', args: [deckLength] });
        return moves;
      }

      // Handle pending favor
      if (G.favorTarget === playerID && G.pendingFavor !== null) {
        console.log('CPU needs to give favor card');
        const hand = G.players[playerID].hand;
        for (let i = 0; i < hand.length; i++) {
          // Prefer giving non-defuse cards
          if (hand[i].type !== CARD_TYPES.DEFUSE) {
            moves.push({ move: 'giveFavorCard', args: [i] });
          }
        }
        // If only defuse cards, give one anyway
        if (moves.length === 0) {
          for (let i = 0; i < hand.length; i++) {
            moves.push({ move: 'giveFavorCard', args: [i] });
          }
        }
        return moves;
      }

      const player = G.players[playerID];
      console.log('CPU player', playerID, 'hand size:', player.hand.length);

      // Find other alive players for targeting
      const alivePlayerIDs = Object.keys(G.players).filter(
        id => id !== playerID && !G.players[id].isEliminated
      );

      // Enumerate card plays
      for (let i = 0; i < player.hand.length; i++) {
        const card = player.hand[i];

        switch (card.type) {
          case CARD_TYPES.SKIP:
          case CARD_TYPES.SHUFFLE:
          case CARD_TYPES.ATTACK:
            moves.push({ move: 'playCard', args: [i] });
            break;

          case CARD_TYPES.FAVOR:
            // Target each alive player
            alivePlayerIDs.forEach(targetID => {
              if (G.players[targetID].hand.length > 0) {
                moves.push({ move: 'playCard', args: [i, parseInt(targetID)] });
              }
            });
            break;

          case CARD_TYPES.CAT: {
            // Check for cat pairs
            const catName = card.name;
            const matchingCats = player.hand.filter(c =>
              c.type === CARD_TYPES.CAT && c.name === catName
            );

            if (matchingCats.length >= 2) {
              // Can play cat pair against each alive player
              alivePlayerIDs.forEach(targetID => {
                if (G.players[targetID].hand.length > 0) {
                  moves.push({ move: 'playCatPair', args: [catName, parseInt(targetID)] });
                }
              });
            }
            break;
          }

          case CARD_TYPES.DEFUSE:
            // Never play defuse cards unless forced
            break;

          default:
            // Unknown card type, can try to play it
            moves.push({ move: 'playCard', args: [i] });
            break;
        }
      }

      // Always include draw card as an option (ends turn)
      moves.push({ move: 'drawCard', args: [] });

      console.log('Generated', moves.length, 'possible moves for CPU', playerID);
      return moves;
    }
  }
};

console.log('Game definition created');

export default ExplodingKittensGame;
