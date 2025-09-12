/**
 * SIMPLIFIED PlayerHand Component for debugging
 * 
 * Minimal version to test basic functionality
 */

import { useState } from 'react';
import PlayerTargetSelection from './PlayerTargetSelection';
import CatPairSelection from './CatPairSelection';

const PlayerHand = ({
  player,
  isActive,
  isCurrentPlayer,
  canPlayCards,
  canDrawCard,
  moves,
  deckCount,
  hasPendingExplodingKitten = false,
  players = {}, // Add players prop for target selection
  gameState = {}, // Add game state for favor handling
  onGiveFavorCard // Add handler for giving favor cards directly
}) => {
  const [showTargetSelection, setShowTargetSelection] = useState(false);
  const [pendingFavorCardIndex, setPendingFavorCardIndex] = useState(null);
  const [showCatPairSelection, setShowCatPairSelection] = useState(false);
  const [availableCatPairs, setAvailableCatPairs] = useState([]);

  // Check if this player needs to give a card for a favor
  const needsToGiveFavorCard = gameState.pendingFavor && gameState.favorTarget === player?.id;

  // Find available cat pairs
  const findCatPairs = () => {
    if (!player?.hand) return [];

    const catGroups = {};
    player.hand.forEach((card, index) => {
      if (card.type === 'cat') {
        if (!catGroups[card.name]) {
          catGroups[card.name] = [];
        }
        catGroups[card.name].push({ card, index });
      }
    });

    const pairs = [];
    Object.entries(catGroups).forEach(([catName, cards]) => {
      if (cards.length >= 2) {
        pairs.push({
          catName,
          cards: cards.slice(0, 2), // Take first 2 cards
          emoji: cards[0].card.emoji
        });
      }
    });

    return pairs;
  };

  console.log('PlayerHand render:', {
    player: player?.name,
    isActive,
    isCurrentPlayer,
    canPlayCards,
    canDrawCard,
    deckCount,
    hasPendingExplodingKitten,
    needsToGiveFavorCard,
    'gameState.pendingFavor': gameState.pendingFavor,
    'gameState.favorTarget': gameState.favorTarget,
    'player.id': player?.id,
    movesKeys: Object.keys(moves || {})
  });

  // Handle card play with validation
  const handleCardPlay = (cardIndex) => {
    console.log('handleCardPlay called:', cardIndex);
    const card = player?.hand?.[cardIndex];

    if (!card) {
      console.log('No card at index:', cardIndex);
      return;
    }

    // If we need to give a card for a favor, handle it directly (not a boardgame.io move)
    if (needsToGiveFavorCard) {
      console.log('Giving card for favor directly:', cardIndex);

      // This should be handled by directly updating the game state
      // Pass the card selection back to the parent component
      if (onGiveFavorCard) {
        onGiveFavorCard(cardIndex);
      } else {
        console.log('No onGiveFavorCard handler provided');
      }
      return;
    }

    // Special handling for Favor cards - show target selection
    if (card.type === 'favor') {
      console.log('Favor card clicked, showing target selection');
      setPendingFavorCardIndex(cardIndex);
      setShowTargetSelection(true);
      return;
    }

    // Special handling for Cat cards - check for pairs
    if (card.type === 'cat') {
      console.log('Cat card clicked, checking for pairs');
      const pairs = findCatPairs();
      const matchingPair = pairs.find(pair => pair.catName === card.name);

      if (matchingPair) {
        console.log('Found matching cat pair for:', card.name);
        setAvailableCatPairs([matchingPair]);
        setShowCatPairSelection(true);
        return;
      } else {
        console.log('No matching pair found for cat:', card.name);
        // Fall through to normal card play (which will just discard it)
      }
    }

    // For other cards, play normally
    if (cardsPlayable && moves.playCard) {
      console.log('Calling moves.playCard for non-favor card');
      moves.playCard(cardIndex);
    } else {
      console.log('Cannot play cards or no playCard move');
    }
  };

  // Handle target selection for Favor cards
  const handleTargetSelection = (targetPlayerID) => {
    console.log('Target selected for favor:', targetPlayerID);
    setShowTargetSelection(false);

    if (pendingFavorCardIndex !== null && moves.playCard) {
      console.log('Playing favor card with target:', pendingFavorCardIndex, targetPlayerID);
      moves.playCard(pendingFavorCardIndex, targetPlayerID);
    }

    setPendingFavorCardIndex(null);
  };

  // Handle cancelling target selection
  const handleCancelTargetSelection = () => {
    console.log('Target selection cancelled');
    setShowTargetSelection(false);
    setPendingFavorCardIndex(null);
  };

  // Handle cat pair target selection
  const handleCatPairTargetSelection = (targetPlayerID, cardIndex) => {
    console.log('Cat pair target and card selected:', targetPlayerID, cardIndex);
    setShowCatPairSelection(false);

    if (availableCatPairs.length > 0 && moves.playCatPair) {
      const catPair = availableCatPairs[0];
      console.log('Playing cat pair:', catPair.catName, 'against player', targetPlayerID);
      // Note: cardIndex is not used in the current game logic, it picks random
      moves.playCatPair(catPair.catName, targetPlayerID);
    }

    setAvailableCatPairs([]);
  };

  // Handle cancelling cat pair selection
  const handleCancelCatPairSelection = () => {
    console.log('Cat pair selection cancelled');
    setShowCatPairSelection(false);
    setAvailableCatPairs([]);
  };

  // Handle draw card with validation
  const handleDrawCard = () => {
    console.log('=== HANDLEDRWCARD CLICKED ===');
    console.log('canDrawCard:', canDrawCard);
    console.log('moves.drawCard exists:', !!moves.drawCard);
    console.log('deckCount:', deckCount);
    console.log('moves object:', moves);
    console.log('typeof moves.drawCard:', typeof moves.drawCard);

    if (canDrawCard && moves.drawCard) {
      console.log('About to call moves.drawCard()');
      try {
        const result = moves.drawCard();
        console.log('moves.drawCard() returned:', result);
      } catch (error) {
        console.error('Error calling moves.drawCard():', error);
      }
    } else {
      console.log('Cannot draw card or no drawCard move available');
      console.log('- canDrawCard:', canDrawCard);
      console.log('- moves.drawCard:', !!moves.drawCard);
    }
    console.log('=== HANDLEDRWCARD END ===');
  };

  // Determine if actions should be enabled
  const actionsEnabled = isActive && isCurrentPlayer && !hasPendingExplodingKitten;
  const drawEnabled = actionsEnabled && canDrawCard && deckCount > 0;
  const cardsPlayable = actionsEnabled && canPlayCards;

  console.log('PlayerHand state:', {
    actionsEnabled,
    drawEnabled,
    cardsPlayable
  });

  if (!player) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Your Hand</h2>
        <div className="text-center py-8 opacity-60">
          <div className="text-4xl mb-2">❌</div>
          <p>Player not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
      {/* Target Selection Modal */}
      {showTargetSelection && (
        <PlayerTargetSelection
          players={players}
          currentPlayerID={player.id}
          onSelectTarget={handleTargetSelection}
          onCancel={handleCancelTargetSelection}
          title="Choose Player for Favor"
          description="Select which player you want to request a card from:"
        />
      )}

      {/* Cat Pair Selection Modal */}
      {showCatPairSelection && availableCatPairs.length > 0 && (
        <CatPairSelection
          catPair={availableCatPairs[0]}
          players={players}
          currentPlayerID={player.id}
          onSelectTarget={handleCatPairTargetSelection}
          onCancel={handleCancelCatPairSelection}
        />
      )}

      {/* Hand Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Hand</h2>
        <div className="text-right">
          <div className="text-lg font-semibold">{player.hand?.length || 0} cards</div>
          {player.isEliminated && (
            <div className="text-red-400 text-sm font-bold">💀 Eliminated</div>
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="mb-4 text-xs bg-black/20 p-2 rounded">
        <div>Current Player: {isCurrentPlayer ? 'YES' : 'NO'}</div>
        <div>Active: {isActive ? 'YES' : 'NO'}</div>
        <div>Can Draw: {canDrawCard ? 'YES' : 'NO'}</div>
        <div>Can Play Cards: {canPlayCards ? 'YES' : 'NO'}</div>
        <div>Deck Count: {deckCount}</div>
        <div>Available Moves: {Object.keys(moves || {}).join(', ')}</div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {/* Draw Card Button */}
          <button
            onClick={handleDrawCard}
            disabled={!drawEnabled}
            className={`
              px-6 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform
              ${drawEnabled
                ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-lg text-white cursor-pointer'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50'
              }
            `}
          >
            🎴 Draw Card
            {deckCount > 0 && (
              <span className="ml-2 text-sm opacity-80">({deckCount} left)</span>
            )}
          </button>

          {/* Turn Status Indicator */}
          <div className={`
            px-4 py-3 rounded-lg font-semibold text-sm flex items-center
            ${isCurrentPlayer && isActive
              ? 'bg-green-500/20 text-green-300 border border-green-500/50'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
            }
          `}>
            {isCurrentPlayer && isActive ? (
              <>
                <span className="animate-pulse mr-2">⚡</span>
                Your Turn!
              </>
            ) : isCurrentPlayer ? (
              <>
                <span className="mr-2">⏳</span>
                Waiting...
              </>
            ) : (
              <>
                <span className="mr-2">👥</span>
                Other's Turn
              </>
            )}
          </div>
        </div>
      </div>

      {/* Player Hand Cards */}
      {player.hand && player.hand.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {player.hand.map((card, index) => {
            // Determine card interactivity based on current state
            let canPlayThisCard, cardAction, cardBgStyle;

            // Check if this cat card has a pair available
            const catPairs = findCatPairs();
            const hasPair = card.type === 'cat' && catPairs.some(pair => pair.catName === card.name);

            if (needsToGiveFavorCard) {
              // In favor giving mode - all cards are selectable
              canPlayThisCard = true;
              cardAction = 'Click to give this card';
              cardBgStyle = 'cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-purple-50 hover:-translate-y-1 border-2 border-purple-300';
            } else {
              // Normal play mode - check if card can be played
              canPlayThisCard = cardsPlayable && (
                card.type === 'skip' ||
                card.type === 'shuffle' ||
                card.type === 'attack' ||
                card.type === 'favor' ||
                card.type === 'see_future' ||
                card.type === 'cat'
              );

              if (card.type === 'favor') {
                cardAction = 'Click to choose target';
              } else if (card.type === 'see_future') {
                cardAction = 'Click to see future';
              } else if (card.type === 'cat' && hasPair) {
                cardAction = 'Click to play pair';
              } else if (card.type === 'cat') {
                cardAction = 'Need pair to play';
                canPlayThisCard = false; // Can't play single cat cards
              } else {
                cardAction = 'Click to play';
              }

              cardBgStyle = canPlayThisCard
                ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-yellow-50 hover:-translate-y-1'
                : 'cursor-not-allowed opacity-75';
            }

            return (
              <div
                key={card.id}
                className={`
                  bg-white text-gray-800 rounded-lg p-3 text-center transition-all duration-200 transform
                  ${cardBgStyle}
                  ${card.type === 'exploding'
                    ? 'border-2 border-red-500 bg-red-50'
                    : card.type === 'defuse'
                      ? 'border-2 border-green-500 bg-green-50'
                      : card.type === 'cat' && hasPair
                        ? 'border-2 border-orange-400 bg-orange-50'
                        : needsToGiveFavorCard
                          ? '' // border already set above
                          : 'border border-gray-200'
                  }
                `}
                onClick={() => canPlayThisCard && handleCardPlay(index)}
              >
                {/* Card Emoji */}
                <div className="text-2xl mb-1">{card.emoji}</div>

                {/* Card Name */}
                <div className="font-bold text-xs mb-1 leading-tight">
                  {card.name}
                </div>

                {/* Card Type */}
                <div className="text-xs opacity-70 leading-tight">
                  {card.type}
                </div>

                {/* Cat Pair Indicator */}
                {card.type === 'cat' && hasPair && (
                  <div className="mt-1 text-xs font-bold text-orange-600">
                    PAIR!
                  </div>
                )}

                {/* Card Type Indicator */}
                {card.type === 'exploding' && (
                  <div className="mt-1 text-xs font-bold text-red-600">
                    DANGER!
                  </div>
                )}
                {card.type === 'defuse' && (
                  <div className="mt-1 text-xs font-bold text-green-600">
                    SAFETY
                  </div>
                )}

                {/* Interactive State Indicator */}
                {canPlayThisCard && (
                  <div className={`mt-1 text-xs opacity-50 ${needsToGiveFavorCard ? 'text-purple-600' : 'text-blue-600'}`}>
                    {cardAction}
                  </div>
                )}
                {!needsToGiveFavorCard && cardsPlayable && !canPlayThisCard && card.type !== 'exploding' && card.type !== 'defuse' && (
                  <div className="mt-1 text-xs text-gray-500 opacity-50">
                    Cannot play
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 opacity-60">
          <div className="text-4xl mb-2">🃏</div>
          <p className="text-lg">No cards in hand</p>
          {player.isEliminated ? (
            <p className="text-sm mt-2 text-red-400">You were eliminated from the game</p>
          ) : (
            <p className="text-sm mt-2">Draw cards to build your hand</p>
          )}
        </div>
      )}

      {/* Hand Management Tips */}
      {player.hand && player.hand.length > 0 && (
        <div className="mt-4 text-center">
          <div className="text-xs opacity-60">
            {needsToGiveFavorCard ? (
              <>🤝 Choose a card to give away! • Click any card to complete the favor for {gameState.players?.[gameState.pendingFavor]?.name || 'the requesting player'}</>
            ) : cardsPlayable ? (
              <>Click cards to play them • Favor cards will ask you to choose a target • Draw a card to end your turn</>
            ) : (
              <>Wait for your turn to play cards</>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;