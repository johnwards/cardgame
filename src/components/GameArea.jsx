/**
 * GameArea Component - Central game area with deck and discard pile display
 * 
 * Implements Task 3.3: Game Area and Status Display Components
 * - Shows draw pile count with visual card representation
 * - Displays discard pile with top card visible
 * - Uses Tailwind CSS for consistent styling and clear visual hierarchy
 */

const GameArea = ({ deck, discardPile }) => {
  const deckCount = deck?.length || 0;
  const topDiscardCard = discardPile?.length > 0 ? discardPile[discardPile.length - 1] : null;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
      <h3 className="text-2xl font-bold text-center mb-6">Game Area</h3>

      <div className="grid grid-cols-2 gap-8">
        {/* Draw Pile */}
        <div className="text-center">
          <h4 className="text-xl font-bold mb-4 text-blue-200">Draw Pile</h4>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-8 min-h-40 flex items-center justify-center shadow-lg border-2 border-blue-400/30">
            <div className="text-center">
              {/* Card Stack Visual Effect */}
              <div className="relative mb-4">
                {deckCount > 0 && (
                  <>
                    {/* Stack effect - multiple card shadows */}
                    <div className="absolute top-1 left-1 w-16 h-20 bg-blue-800/40 rounded-lg"></div>
                    <div className="absolute top-0.5 left-0.5 w-16 h-20 bg-blue-700/50 rounded-lg"></div>
                    <div className="w-16 h-20 bg-blue-600 rounded-lg flex items-center justify-center mx-auto border-2 border-blue-300/50">
                      <div className="text-4xl">🎴</div>
                    </div>
                  </>
                )}
                {deckCount === 0 && (
                  <div className="w-16 h-20 bg-gray-600/50 rounded-lg flex items-center justify-center mx-auto border-2 border-gray-400/30 opacity-50">
                    <div className="text-3xl opacity-60">❌</div>
                  </div>
                )}
              </div>

              {/* Deck Count */}
              <div className="font-bold text-2xl mb-1">{deckCount}</div>
              <div className="text-sm opacity-80">
                {deckCount === 1 ? 'card' : 'cards'} remaining
              </div>

              {/* Deck Status */}
              <div className="mt-3 text-xs">
                {deckCount > 10 && (
                  <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded-full">
                    Safe
                  </span>
                )}
                {deckCount > 0 && deckCount <= 10 && (
                  <span className="px-2 py-1 bg-yellow-500/30 text-yellow-200 rounded-full">
                    Getting Low
                  </span>
                )}
                {deckCount === 0 && (
                  <span className="px-2 py-1 bg-red-500/30 text-red-200 rounded-full">
                    Empty
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Discard Pile */}
        <div className="text-center">
          <h4 className="text-xl font-bold mb-4 text-gray-200">Discard Pile</h4>
          <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl p-8 min-h-40 flex items-center justify-center shadow-lg border-2 border-gray-400/30">
            <div className="text-center">
              {topDiscardCard ? (
                <>
                  {/* Top Card Display */}
                  <div className="relative mb-4">
                    {/* Stack effect for discard pile */}
                    {discardPile.length > 1 && (
                      <>
                        <div className="absolute top-1 left-1 w-16 h-20 bg-gray-800/40 rounded-lg"></div>
                        <div className="absolute top-0.5 left-0.5 w-16 h-20 bg-gray-700/50 rounded-lg"></div>
                      </>
                    )}
                    <div className={`
                      w-16 h-20 rounded-lg flex items-center justify-center mx-auto border-2 
                      ${topDiscardCard.type === 'exploding'
                        ? 'bg-red-600 border-red-300/50'
                        : topDiscardCard.type === 'defuse'
                          ? 'bg-green-600 border-green-300/50'
                          : 'bg-white border-gray-300/50'
                      }
                    `}>
                      <div className={`text-4xl ${topDiscardCard.type === 'exploding' || topDiscardCard.type === 'defuse' ? 'text-white' : 'text-gray-800'}`}>
                        {topDiscardCard.emoji}
                      </div>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="font-bold text-lg mb-1">{topDiscardCard.name}</div>
                  <div className="text-sm opacity-80 mb-2">{topDiscardCard.description}</div>

                  {/* Discard Pile Count */}
                  <div className="text-xs opacity-70">
                    {discardPile.length} {discardPile.length === 1 ? 'card' : 'cards'} discarded
                  </div>

                  {/* Card Type Indicator */}
                  <div className="mt-2">
                    {topDiscardCard.type === 'exploding' && (
                      <span className="px-2 py-1 bg-red-500/30 text-red-200 rounded-full text-xs">
                        Dangerous
                      </span>
                    )}
                    {topDiscardCard.type === 'defuse' && (
                      <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded-full text-xs">
                        Safety
                      </span>
                    )}
                    {(topDiscardCard.type === 'skip' || topDiscardCard.type === 'favor' || topDiscardCard.type === 'shuffle' || topDiscardCard.type === 'attack' || topDiscardCard.type === 'cat') && (
                      <span className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs">
                        Action
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Empty Discard Pile */}
                  <div className="w-16 h-20 bg-gray-700/50 rounded-lg flex items-center justify-center mx-auto border-2 border-gray-500/30 opacity-50 mb-4">
                    <div className="text-3xl opacity-60">🗑️</div>
                  </div>
                  <div className="font-bold text-lg mb-1 opacity-60">Empty</div>
                  <div className="text-sm opacity-50">No cards discarded yet</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Game Area Stats */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-bold text-lg">{deckCount}</div>
            <div className="opacity-70">Draw Pile</div>
          </div>
          <div>
            <div className="font-bold text-lg">{discardPile?.length || 0}</div>
            <div className="opacity-70">Discarded</div>
          </div>
          <div>
            <div className="font-bold text-lg">{deckCount + (discardPile?.length || 0)}</div>
            <div className="opacity-70">Total Cards</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameArea;