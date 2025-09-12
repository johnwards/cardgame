/**
 * Modal for placing Exploding Kittens back into the deck after defusing
 */

const ExplodingKittenPlacement = ({ 
  isVisible, 
  deckLength, 
  onPlaceKitten,
  playerName = "You" 
}) => {
  if (!isVisible) return null;

  const handlePlacement = (position) => {
    if (onPlaceKitten) {
      onPlaceKitten(position);
    }
  };

  const topPosition = 0;
  const middlePosition = Math.floor(deckLength / 2);
  const bottomPosition = deckLength;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-red-900 to-red-700 rounded-xl p-8 max-w-md w-full mx-4 border-2 border-red-500 shadow-2xl shadow-red-500/50">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">💥🐱</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Exploding Kitten Defused!
          </h3>
          <p className="text-red-200">
            {playerName} successfully defused the Exploding Kitten!
          </p>
        </div>

        <div className="bg-red-800/50 rounded-lg p-4 mb-6 border border-red-600/50">
          <p className="text-white text-center font-semibold mb-2">
            🎯 Choose where to place it back in the deck:
          </p>
          <div className="text-red-200 text-sm text-center">
            The next player to draw from that position will get the Exploding Kitten!
          </div>
        </div>

        <div className="mb-6">
          <div className="text-center text-white mb-3">
            <div className="text-sm opacity-80">Current deck: {deckLength} cards</div>
          </div>
          
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="flex flex-col items-center">
              <div className="text-xs text-white mb-1">Top</div>
              <div className="w-8 h-10 bg-blue-600 rounded border-2 border-blue-400 shadow-lg"></div>
            </div>
            
            <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"></div>
            
            <div className="flex flex-col items-center">
              <div className="text-xs text-white mb-1">Middle</div>
              <div className="w-8 h-10 bg-purple-600 rounded border-2 border-purple-400 shadow-lg"></div>
            </div>
            
            <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400"></div>
            
            <div className="flex flex-col items-center">
              <div className="text-xs text-white mb-1">Bottom</div>
              <div className="w-8 h-10 bg-blue-600 rounded border-2 border-blue-400 shadow-lg"></div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handlePlacement(topPosition)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg border-2 border-red-500"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⬆️</span>
                <div className="text-left">
                  <div className="font-bold">Top of Deck</div>
                  <div className="text-sm opacity-90">Next player will draw it!</div>
                </div>
              </div>
              <div className="text-sm bg-red-500/50 px-2 py-1 rounded">
                Most Dangerous
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePlacement(middlePosition)}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg border-2 border-orange-500"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔄</span>
                <div className="text-left">
                  <div className="font-bold">Middle of Deck</div>
                  <div className="text-sm opacity-90">Someone will get it eventually</div>
                </div>
              </div>
              <div className="text-sm bg-orange-500/50 px-2 py-1 rounded">
                Balanced Risk
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePlacement(bottomPosition)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg border-2 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⬇️</span>
                <div className="text-left">
                  <div className="font-bold">Bottom of Deck</div>
                  <div className="text-sm opacity-90">Last to be drawn</div>
                </div>
              </div>
              <div className="text-sm bg-yellow-500/50 px-2 py-1 rounded">
                Safest Option
              </div>
            </div>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-red-600/50">
          <div className="text-center">
            <div className="text-white text-sm opacity-80 mb-2">
              Or choose a specific position:
            </div>
            <div className="flex items-center justify-center space-x-2">
              <input
                type="number"
                min="0"
                max={deckLength}
                placeholder="Position"
                className="w-20 px-2 py-1 rounded bg-red-800 text-white border border-red-600 text-center"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt(e.target.value);
                    if (value >= 0 && value <= deckLength) {
                      handlePlacement(value);
                    }
                  }
                }}
              />
              <span className="text-white text-sm">
                (0 = top, {deckLength} = bottom)
              </span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mt-6 bg-yellow-900/50 border border-yellow-600/50 rounded-lg p-3">
          <div className="text-yellow-200 text-sm text-center">
            ⚠️ Choose carefully! This decision affects all players' safety.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplodingKittenPlacement;