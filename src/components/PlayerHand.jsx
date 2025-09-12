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
  players = {},
  gameState = {},
  onGiveFavorCard
}) => {
  const [showTargetSelection, setShowTargetSelection] = useState(false);
  const [pendingFavorCardIndex, setPendingFavorCardIndex] = useState(null);
  const [showCatPairSelection, setShowCatPairSelection] = useState(false);
  const [availableCatPairs, setAvailableCatPairs] = useState([]);

  const needsToGiveFavorCard = gameState.pendingFavor && gameState.favorTarget === player?.id;

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
          cards: cards.slice(0, 2),
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

  const handleCardPlay = (cardIndex) => {
    console.log('handleCardPlay called:', cardIndex);
    const card = player?.hand?.[cardIndex];

    if (!card) {
      console.log('No card at index:', cardIndex);
      return;
    }

    // Favor card selection bypasses normal game moves
    if (needsToGiveFavorCard) {
      console.log('Giving card for favor directly:', cardIndex);

      if (onGiveFavorCard) {
        onGiveFavorCard(cardIndex);
      } else {
        console.log('No onGiveFavorCard handler provided');
      }
      return;
    }

    if (card.type === 'favor') {
      console.log('Favor card clicked, showing target selection');
      setPendingFavorCardIndex(cardIndex);
      setShowTargetSelection(true);
      return;
    }

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
        // Single cats just get discarded
      }
    }

    if (cardsPlayable && moves.playCard) {
      console.log('Calling moves.playCard for non-favor card');
      moves.playCard(cardIndex);
    } else {
      console.log('Cannot play cards or no playCard move');
    }
  };

  const handleTargetSelection = (targetPlayerID) => {
    console.log('Target selected for favor:', targetPlayerID);
    setShowTargetSelection(false);

    if (pendingFavorCardIndex !== null && moves.playCard) {
      console.log('Playing favor card with target:', pendingFavorCardIndex, targetPlayerID);
      moves.playCard(pendingFavorCardIndex, targetPlayerID);
    }

    setPendingFavorCardIndex(null);
  };

  const handleCancelTargetSelection = () => {
    console.log('Target selection cancelled');
    setShowTargetSelection(false);
    setPendingFavorCardIndex(null);
  };

  const handleCatPairTargetSelection = (targetPlayerID, cardIndex) => {
    console.log('Cat pair target and card selected:', targetPlayerID, cardIndex);
    setShowCatPairSelection(false);

    if (availableCatPairs.length > 0 && moves.playCatPair) {
      const catPair = availableCatPairs[0];
      console.log('Playing cat pair:', catPair.catName, 'against player', targetPlayerID);
      // Game logic picks random card from target
      moves.playCatPair(catPair.catName, targetPlayerID);
    }

    setAvailableCatPairs([]);
  };

  const handleCancelCatPairSelection = () => {
    console.log('Cat pair selection cancelled');
    setShowCatPairSelection(false);
    setAvailableCatPairs([]);
  };

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
    <div className="h-full flex flex-col bg-transparent">
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

      {showCatPairSelection && availableCatPairs.length > 0 && (
        <CatPairSelection
          catPair={availableCatPairs[0]}
          players={players}
          currentPlayerID={player.id}
          onSelectTarget={handleCatPairTargetSelection}
          onCancel={handleCancelCatPairSelection}
        />
      )}

      {/* Player Header */}
      <div className="bg-white/20 backdrop-blur-md text-white p-4 border-b border-white/20">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black text-white drop-shadow-lg">YOUR HAND</h2>
          <div className="text-right">
            <div className="text-lg font-bold text-white drop-shadow-lg">{player.hand?.length || 0} CARDS</div>
            {player.isEliminated && (
              <div className="text-red-400 text-sm font-bold">💀 ELIMINATED</div>
            )}
          </div>
        </div>
      </div>

      {/* Turn Status & Draw Button */}
      <div className="bg-white/10 backdrop-blur-sm p-4 border-b border-white/20">
        <div className="flex flex-col gap-3">

          {/* Turn Indicator */}
          <div className={`
            text-center py-2 px-4 rounded-full font-bold text-sm border backdrop-blur-sm
            ${isCurrentPlayer && isActive
              ? 'bg-green-500/80 text-white border-green-400 animate-gentle-pulse'
              : 'bg-gray-600/80 text-gray-200 border-gray-500'
            }
          `}>
            {isCurrentPlayer && isActive ? (
              <>⚡ YOUR TURN!</>
            ) : isCurrentPlayer ? (
              <>⏳ WAITING...</>
            ) : (
              <>👥 OTHER'S TURN</>
            )}
          </div>

          {/* Draw Button */}
          <button
            onClick={handleDrawCard}
            disabled={!drawEnabled}
            className={`
              w-full py-4 rounded-xl font-black text-lg transition-all duration-200 transform border backdrop-blur-sm
              ${drawEnabled
                ? 'bg-blue-600/90 hover:bg-blue-700/90 text-white border-blue-400 hover:scale-105 shadow-lg cursor-pointer'
                : 'bg-gray-600/60 text-gray-300 border-gray-500 cursor-not-allowed opacity-50'
              }
            `}
          >
            🎴 DRAW CARD
            {deckCount > 0 && (
              <div className="text-sm opacity-80">({deckCount} left)</div>
            )}
          </button>
        </div>
      </div>      {/* Cards Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        {player.hand && player.hand.length > 0 ? (
          <>
            {/* Special Instructions */}
            {needsToGiveFavorCard && (
              <div className="bg-purple-600/80 rounded-lg p-3 mb-4 text-center text-white animate-pulse">
                <div className="font-bold text-sm">🤝 GIVE A CARD</div>
                <div className="text-xs">Click any card to give to {gameState.players?.[gameState.pendingFavor]?.name}</div>
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {player.hand.map((card, index) => {
                let canPlayThisCard, cardAction, cardBgStyle;

                const catPairs = findCatPairs();
                const hasPair = card.type === 'cat' && catPairs.some(pair => pair.catName === card.name);

                if (needsToGiveFavorCard) {
                  canPlayThisCard = true;
                  cardAction = 'Give card';
                  cardBgStyle = 'cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-purple-50 hover:-translate-y-1 border-2 border-purple-400';
                } else {
                  canPlayThisCard = cardsPlayable && (
                    card.type === 'skip' ||
                    card.type === 'shuffle' ||
                    card.type === 'attack' ||
                    card.type === 'favor' ||
                    card.type === 'see_future' ||
                    card.type === 'cat'
                  );

                  if (card.type === 'favor') {
                    cardAction = 'Choose target';
                  } else if (card.type === 'see_future') {
                    cardAction = 'See future';
                  } else if (card.type === 'cat' && hasPair) {
                    cardAction = 'Play pair';
                  } else if (card.type === 'cat') {
                    cardAction = 'Need pair';
                    canPlayThisCard = false;
                  } else {
                    cardAction = 'Play';
                  }

                  cardBgStyle = canPlayThisCard
                    ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-yellow-50 hover:-translate-y-1 border-2 border-green-400'
                    : 'cursor-not-allowed opacity-75 border border-gray-300';
                }

                return (
                  <div
                    key={card.id}
                    className={`
                      bg-white text-gray-800 rounded-lg p-3 text-center transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                      ${cardBgStyle}
                      ${card.type === 'exploding'
                        ? 'border-2 border-red-500 bg-red-50'
                        : card.type === 'defuse'
                          ? 'border-2 border-green-500 bg-green-50'
                          : card.type === 'cat' && hasPair
                            ? 'border-2 border-orange-400 bg-orange-50'
                            : needsToGiveFavorCard
                              ? '' // border already set above
                              : ''
                      }
                    `}
                    onClick={() => canPlayThisCard && handleCardPlay(index)}
                  >
                    <div className="text-2xl mb-1">{card.emoji}</div>

                    <div className="font-bold text-xs mb-1 leading-tight">
                      {card.name}
                    </div>

                    <div className="text-xs opacity-70 leading-tight">
                      {card.type}
                    </div>

                    {card.type === 'cat' && hasPair && (
                      <div className="mt-1 text-xs font-bold text-orange-600">
                        PAIR!
                      </div>
                    )}

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

                    {canPlayThisCard && (
                      <div className={`mt-1 text-xs opacity-60 font-bold ${needsToGiveFavorCard ? 'text-purple-600' : 'text-blue-600'}`}>
                        {cardAction}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Help Text */}
            <div className="mt-4 text-center">
              <div className="text-xs opacity-70 text-white bg-black/20 rounded-lg p-2">
                {needsToGiveFavorCard ? (
                  <>🤝 Click any card to complete the favor</>
                ) : cardsPlayable ? (
                  <>Click cards to play them • Draw to end turn</>
                ) : (
                  <>Wait for your turn to play cards</>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-white/60">
            <div className="text-4xl mb-3">🃏</div>
            <p className="text-lg font-bold">No Cards</p>
            {player.isEliminated ? (
              <p className="text-sm mt-2 text-red-400">You were eliminated!</p>
            ) : (
              <p className="text-sm mt-2">Draw cards to build your hand</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerHand;