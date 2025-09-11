/**
 * SIMPLIFIED PlayerHand Component for debugging
 * 
 * Minimal version to test basic functionality
 */

const PlayerHand = ({
  player,
  isActive,
  isCurrentPlayer,
  canPlayCards,
  canDrawCard,
  moves,
  deckCount,
  hasPendingExplodingKitten = false
}) => {
  console.log('PlayerHand render:', {
    player: player?.name,
    isActive,
    isCurrentPlayer,
    canPlayCards,
    canDrawCard,
    deckCount,
    hasPendingExplodingKitten,
    movesKeys: Object.keys(moves || {})
  });

  // Handle card play with validation
  const handleCardPlay = (cardIndex) => {
    console.log('handleCardPlay called:', cardIndex);
    if (cardsPlayable && moves.playCard) {
      console.log('Calling moves.playCard');
      moves.playCard(cardIndex);
    } else {
      console.log('Cannot play cards or no playCard move');
    }
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
            // Check if this specific card can be played
            const canPlayThisCard = cardsPlayable && (
              card.type === 'skip' ||
              card.type === 'shuffle' ||
              card.type === 'attack' ||
              card.type === 'favor' ||
              card.type === 'cat'
            );

            return (
              <div
                key={card.id}
                className={`
                  bg-white text-gray-800 rounded-lg p-3 text-center transition-all duration-200 transform
                  ${canPlayThisCard
                    ? 'cursor-pointer hover:shadow-xl hover:scale-105 hover:bg-yellow-50 hover:-translate-y-1'
                    : 'cursor-not-allowed opacity-75'
                  }
                  ${card.type === 'exploding'
                    ? 'border-2 border-red-500 bg-red-50'
                    : card.type === 'defuse'
                      ? 'border-2 border-green-500 bg-green-50'
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
                  <div className="mt-1 text-xs text-blue-600 opacity-50">
                    Click to play
                  </div>
                )}
                {cardsPlayable && !canPlayThisCard && card.type !== 'exploding' && card.type !== 'defuse' && (
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
            {cardsPlayable ? (
              <>Click cards to play them • Draw a card to end your turn</>
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