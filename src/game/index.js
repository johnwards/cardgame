import { INVALID_MOVE } from 'boardgame.io/core';
import { setupGameDeck, CARD_TYPES } from '../constants/cards.js';

let globalSelectedFavorCard = null;

console.log('Game file loading...');

const ExplodingKittensGame = {
  name: 'exploding-kittens-phase-c',

  setup: ({ ctx, random }) => {
    console.log('Phase A Setup called with numPlayers:', ctx.numPlayers);

    const numPlayers = 4;
    const { dealtCards, finalDeck } = setupGameDeck(numPlayers, random);
    const players = {};
    for (let i = 0; i < numPlayers; i++) {
      players[i] = {
        id: i,
        name: i === 0 ? 'You' : `CPU ${i}`,
        hand: dealtCards[i],
        isEliminated: false,
        isCPU: i !== 0
      };
    }

    const gameState = {
      players,
      deck: finalDeck,
      discardPile: [],
      pendingExplodingKitten: null,
      pendingPlayer: null,
      turnsRemaining: {},
      pendingFavor: null,
      favorTarget: null,
      waitingForFavor: null,
      seeTheFutureCards: null,
      seeTheFuturePlayer: null,
      attackNotification: null
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

      if (G.pendingFavor && G.favorTarget && G.favorTarget !== playerID) {
        console.log('Cannot play cards while favor is pending for another player');
        return INVALID_MOVE;
      }

      if (cardIndex < 0 || cardIndex >= G.players[playerID].hand.length) {
        console.log('Invalid card index');
        return INVALID_MOVE;
      }

      const card = G.players[playerID].hand[cardIndex];
      console.log('Attempting to play card:', card.name, 'type:', card.type);

      G.players[playerID].hand.splice(cardIndex, 1);
      G.discardPile.push(card);

      switch (card.type) {
        case CARD_TYPES.SKIP:
          console.log('Skip card played - ending turn without drawing');
          if (G.turnsRemaining[playerID] && G.turnsRemaining[playerID] > 1) {
            G.turnsRemaining[playerID]--;
            console.log('Player', playerID, 'skipped one turn, has', G.turnsRemaining[playerID], 'turns remaining');
          } else {
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
          while (G.players[nextPlayer]?.isEliminated) {
            nextPlayer = (nextPlayer + 1) % Object.keys(G.players).length;
          }
          G.turnsRemaining[nextPlayer] = (G.turnsRemaining[nextPlayer] || 1) + 1;
          console.log('Next player', nextPlayer, 'now has', G.turnsRemaining[nextPlayer], 'turns');

          // Show notification when CPU attacks human player
          if (G.players[playerID]?.isCPU && nextPlayer === 0) {
            console.log('CPU', playerID, 'attacked human player - setting notification');
            G.attackNotification = {
              attackerName: G.players[playerID].name,
              targetPlayer: nextPlayer,
              remainingTurns: G.turnsRemaining[nextPlayer],
              timestamp: Date.now()
            };
          }

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

          // CPU targets give cards immediately, humans require selection
          if (G.players[targetPlayerID].isCPU) {
            console.log('Target is CPU, immediately giving random card');
            const targetHand = G.players[targetPlayerID].hand;
            const randomIndex = Math.floor(Math.random() * targetHand.length);
            const givenCard = targetHand.splice(randomIndex, 1)[0];
            G.players[playerID].hand.push(givenCard);
            console.log('CPU gave card:', givenCard.name);
          } else {
            // AI waits for human to select card via UI
            G.pendingFavor = playerID;
            G.favorTarget = targetPlayerID;
            G.waitingForFavor = playerID;
            console.log('AI player', playerID, 'is now waiting for favor from human', targetPlayerID);
          }
          break;

        case CARD_TYPES.CAT:
          console.log('Cat card played - but no special effect for single cat');
          break;

        case CARD_TYPES.SEE_FUTURE:
          console.log('See the Future card played');
          // Only show cards to human players
          if (!G.players[playerID].isCPU) {
            const futureCards = G.deck.slice(-3).reverse();
            G.seeTheFutureCards = futureCards;
            G.seeTheFuturePlayer = playerID;
            console.log('Human player can see future cards:', futureCards.map(c => c.name));
          } else {
            console.log('CPU player used See the Future - no effect for AI');
          }
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

      if (G.pendingFavor && G.favorTarget && G.favorTarget !== playerID) {
        console.log('Cannot draw cards while favor is pending for another player');
        return INVALID_MOVE;
      }

      if (G.deck.length === 0) {
        console.log('🚨 DECK EMPTY - this should not happen in Exploding Kittens!');
        console.log('🚨 Total exploding kittens that should exist:', 3);
        console.log('🚨 Players alive:', Object.values(G.players).filter(p => !p.isEliminated).length);

        // This is an error state - log detailed info for debugging
        console.log('🚨 Player hands:', Object.values(G.players).map(p => ({
          id: p.id,
          name: p.name,
          isEliminated: p.isEliminated,
          handSize: p.hand.length,
          defuseCount: p.hand.filter(c => c.type === CARD_TYPES.DEFUSE).length
        })));
        console.log('🚨 Discard pile size:', G.discardPile.length);
        console.log('🚨 Discard pile exploding kittens:', G.discardPile.filter(c => c.type === CARD_TYPES.EXPLODING).length);

        return INVALID_MOVE;
      }

      const card = G.deck.pop();
      console.log('Drew card:', card.name, 'type:', card.type);

      if (card.type === CARD_TYPES.EXPLODING) {
        console.log('EXPLODING KITTEN DRAWN!');

        const defuseIndex = G.players[playerID].hand.findIndex(
          c => c.type === CARD_TYPES.DEFUSE
        );

        if (defuseIndex !== -1) {
          console.log('🛡️ Player has defuse card at index:', defuseIndex);
          console.log('🛡️ Defuse card details:', G.players[playerID].hand[defuseIndex]);
          console.log('🛡️ Player hand before defuse:', G.players[playerID].hand.length, 'cards');
          console.log('🛡️ Discard pile before defuse:', G.discardPile.length, 'cards');

          const defuseCard = G.players[playerID].hand.splice(defuseIndex, 1)[0];
          G.discardPile.push(defuseCard);

          console.log('🛡️ DEFUSE CARD CONSUMED!');
          console.log('🛡️ Player hand after defuse:', G.players[playerID].hand.length, 'cards');
          console.log('🛡️ Discard pile after defuse:', G.discardPile.length, 'cards');
          console.log('🛡️ Defused card moved to discard:', defuseCard.name);

          G.pendingExplodingKitten = card;
          G.pendingPlayer = playerID;

          console.log('🛡️ Defuse used, awaiting exploding kitten placement');

          return;
        } else {
          console.log('💀 Player has no defuse card - ELIMINATED!');
          console.log('💀 Player', playerID, 'hand contents:', G.players[playerID].hand.map(c => c.type));
          console.log('💀 Player elimination status before:', G.players[playerID].isEliminated);

          G.players[playerID].isEliminated = true;

          console.log('💀 PLAYER ELIMINATED!');
          console.log('💀 Player', playerID, 'elimination status after:', G.players[playerID].isEliminated);
          console.log('💀 Player name:', G.players[playerID].name);

          const alivePlayers = Object.values(G.players).filter(p => !p.isEliminated);
          console.log('💀 Players remaining alive:', alivePlayers.length);
          console.log('💀 Alive players:', alivePlayers.map(p => p.name));

          if (alivePlayers.length === 1) {
            console.log('Game over - single winner!');
          }

          console.log('Ending turn after player elimination');
          events.endTurn();
          return;
        }
      } else {
        G.players[playerID].hand.push(card);
        console.log('Regular card added to hand');
      }

      if (G.turnsRemaining[playerID] && G.turnsRemaining[playerID] > 1) {
        G.turnsRemaining[playerID]--;
        console.log('Player', playerID, 'has', G.turnsRemaining[playerID], 'turns remaining, not ending turn');
        return;
      } else {
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

      if (position < 0 || position > G.deck.length) {
        console.log('Invalid position:', position, 'deck length:', G.deck.length);
        return INVALID_MOVE;
      }

      let actualPosition;
      if (position === 0) {
        actualPosition = G.deck.length; // Top = next to draw
      } else if (position === G.deck.length) {
        actualPosition = 0; // Bottom = last to draw
      } else {
        actualPosition = G.deck.length - position;
      }

      console.log('💣 Requested position:', position, '(0=top, ' + G.deck.length + '=bottom)');
      console.log('💣 Actual array position:', actualPosition);

      G.deck.splice(actualPosition, 0, G.pendingExplodingKitten);

      console.log('💣 EXPLODING KITTEN PLACED!');
      console.log('💣 Deck length after placement:', G.deck.length);
      console.log('💣 Deck top 3 cards after placement (next to draw first):', G.deck.slice(-3).map(c => c.name).reverse());
      console.log('💣 Card placed:', G.pendingExplodingKitten.name);
      console.log('💣 Note: Position 0 = top of deck = next card to be drawn = end of array');

      G.pendingExplodingKitten = null;
      G.pendingPlayer = null;

      if (G.turnsRemaining[playerID] && G.turnsRemaining[playerID] > 1) {
        G.turnsRemaining[playerID]--;
        console.log('Player', playerID, 'placed exploding kitten, has', G.turnsRemaining[playerID], 'turns remaining');
      } else {
        G.turnsRemaining[playerID] = 1;
        console.log('Exploding kitten placement ends turn - passing to next player');
        events.endTurn();
      }

      console.log('=== PLACE EXPLODING KITTEN COMPLETE ===');
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

      const catCards = G.players[playerID].hand.filter(
        card => card.type === CARD_TYPES.CAT && card.name === catName
      );

      if (catCards.length < 2) {
        console.log('Not enough matching cat cards');
        return INVALID_MOVE;
      }

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

      const targetHand = G.players[targetPlayerID].hand;
      const randomIndex = random.Die(targetHand.length) - 1;
      const stolenCard = targetHand.splice(randomIndex, 1)[0];
      G.players[playerID].hand.push(stolenCard);

      console.log('Cat pair played - stolen card:', stolenCard.name);
      console.log('=== PLAY CAT PAIR COMPLETE ===');
    },

    dismissSeeTheFuture: ({ G, playerID }) => {
      console.log('=== DISMISS SEE THE FUTURE MOVE CALLED ===');
      console.log('playerID:', playerID);

      if (G.seeTheFuturePlayer !== playerID) {
        console.log('No see the future active for this player');
        return INVALID_MOVE;
      }

      G.seeTheFutureCards = null;
      G.seeTheFuturePlayer = null;

      console.log('See the Future dismissed');
      console.log('=== DISMISS SEE THE FUTURE COMPLETE ===');
    },

    dismissAttackNotification: ({ G, playerID }) => {
      console.log('=== DISMISS ATTACK NOTIFICATION MOVE CALLED ===');
      console.log('playerID:', playerID);

      G.attackNotification = null;

      console.log('Attack notification dismissed');
      console.log('=== DISMISS ATTACK NOTIFICATION COMPLETE ===');
    },

    waitingForFavor: ({ G, playerID }) => {
      console.log('=== WAITING FOR FAVOR MOVE CALLED ===');
      console.log('playerID:', playerID, 'is waiting for favor');
      console.log('waitingForFavor state:', G.waitingForFavor);
      console.log('globalSelectedFavorCard:', globalSelectedFavorCard);

      // Complete favor if human has selected a card
      if (globalSelectedFavorCard !== null && globalSelectedFavorCard !== undefined) {
        console.log('Human selected card index:', globalSelectedFavorCard);

        const targetPlayerID = G.favorTarget;
        const favorRequesterID = G.pendingFavor;

        if (globalSelectedFavorCard < 0 || globalSelectedFavorCard >= G.players[targetPlayerID].hand.length) {
          console.log('Invalid selected card index');
          globalSelectedFavorCard = null;
          return;
        }

        const card = G.players[targetPlayerID].hand.splice(globalSelectedFavorCard, 1)[0];
        G.players[favorRequesterID].hand.push(card);

        console.log('FAVOR COMPLETED! Card transferred:', card.name);
        console.log('From player', targetPlayerID, 'to player', favorRequesterID);

        G.pendingFavor = null;
        G.favorTarget = null;
        G.waitingForFavor = null;
        globalSelectedFavorCard = null;

        console.log('Favor state cleared - AI can now make normal moves');
        return;
      }

      console.log('Still waiting for human to select card...');

      console.log('=== WAITING FOR FAVOR COMPLETE ===');
    }
  },

  turn: {
    onBegin: ({ G, ctx, events }) => {
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

    if (alivePlayers.length === 0) {
      console.log('Game over - all players eliminated');
      return {
        winner: null,
        winnerName: "No survivors",
        reason: "All players eliminated"
      };
    }

    // Game continues as long as there are players alive and moves to be made
    // Deck exhaustion should not end the game - players must draw exploding kittens
    return false;
  },

  ai: {
    enumerate: (G, ctx) => {
      console.log('=== AI ENUMERATE CALLED ===');
      const playerID = ctx.currentPlayer;
      const moves = [];

      console.log('CPU player', playerID, 'is active, generating moves...');

      if (G.waitingForFavor === playerID) {
        console.log('AI player', playerID, 'is waiting for favor - can only make waitingForFavor move');
        moves.push({ move: 'waitingForFavor', args: [] });
        return moves;
      }

      if (G.pendingExplodingKitten && G.pendingPlayer === playerID) {
        console.log('CPU needs to place exploding kitten');
        const deckLength = G.deck.length;
        moves.push({ move: 'placeExplodingKitten', args: [0] });
        moves.push({ move: 'placeExplodingKitten', args: [Math.floor(deckLength / 3)] });
        moves.push({ move: 'placeExplodingKitten', args: [Math.floor(deckLength * 2 / 3)] });
        moves.push({ move: 'placeExplodingKitten', args: [deckLength] });
        return moves;
      }

      const player = G.players[playerID];
      console.log('CPU player', playerID, 'hand size:', player.hand.length);

      const alivePlayerIDs = Object.keys(G.players).filter(
        id => id !== playerID && !G.players[id].isEliminated
      );

      for (let i = 0; i < player.hand.length; i++) {
        const card = player.hand[i];

        switch (card.type) {
          case CARD_TYPES.SKIP:
          case CARD_TYPES.SHUFFLE:
          case CARD_TYPES.ATTACK:
          case CARD_TYPES.SEE_FUTURE:
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
            break;

          default:
            // Unknown card type, can try to play it
            moves.push({ move: 'playCard', args: [i] });
            break;
        }
      }

      // Only allow draw if deck has cards
      if (G.deck.length > 0) {
        moves.push({ move: 'drawCard', args: [] });
      } else {
        console.log('🚨 AI cannot generate drawCard move - deck is empty!');
      }

      console.log('Generated', moves.length, 'possible moves for CPU', playerID);
      return moves;
    }
  }
};

console.log('Game definition created');

export const setGlobalSelectedFavorCard = (cardIndex) => {
  globalSelectedFavorCard = cardIndex;
};

export default ExplodingKittensGame;
