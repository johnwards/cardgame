/**
 * OtherPlayers Component - Display other players' status without revealing cards
 * 
 * Implements Task 3.2: Player Hand and Card Interaction Components
 * - Display other players' card counts and elimination status without revealing cards
 * - Show turn indicators and player status
 * - Use Tailwind CSS for consistent styling and clear visual hierarchy
 */

const OtherPlayers = ({ players, currentPlayer, playerID }) => {
  // Ensure players is an object and playerID is defined
  if (!players || typeof players !== 'object') {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Other Players</h2>
        <div className="text-center py-8 opacity-60">
          <div className="text-4xl mb-2">⚠️</div>
          <p>Invalid player data</p>
        </div>
      </div>
    );
  }

  // Filter out the human player to show only other players
  const otherPlayers = Object.values(players).filter(player => player.id !== playerID);

  // Helper function to get player status for display
  const getPlayerStatus = (player) => {
    if (player.isEliminated) return { text: 'Eliminated', icon: '💀', color: 'text-red-400' };
    if (currentPlayer === player.id) return { text: 'Current Turn', icon: '⚡', color: 'text-yellow-400' };
    return { text: 'Waiting', icon: '⏳', color: 'text-gray-300' };
  };

  // Helper function to get player card count display
  const getPlayerCardCount = (player) => {
    const count = player.hand?.length || 0;
    return count === 1 ? '1 card' : `${count} cards`;
  };

  // Helper function to determine player card color theme
  const getPlayerCardTheme = (player) => {
    if (player.isEliminated) {
      return 'border-red-400 bg-red-400/20 opacity-60';
    }
    if (currentPlayer === player.id) {
      return 'border-yellow-400 bg-yellow-400/20 shadow-lg';
    }
    return 'border-white/30 bg-white/10 hover:bg-white/15';
  };

  if (otherPlayers.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Other Players</h2>
        <div className="text-center py-8 opacity-60">
          <div className="text-4xl mb-2">👥</div>
          <p>Waiting for other players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <span className="mr-2">👥</span>
        Other Players
        <span className="ml-2 text-sm opacity-70">({otherPlayers.length})</span>
      </h2>

      {/* Players List */}
      <div className="space-y-4">
        {otherPlayers.map((player) => {
          const status = getPlayerStatus(player);
          const cardCount = getPlayerCardCount(player);
          const theme = getPlayerCardTheme(player);

          return (
            <div
              key={player.id}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 transform
                ${theme}
                ${currentPlayer === player.id ? 'animate-pulse scale-105' : ''}
              `}
            >
              <div className="flex justify-between items-center">
                {/* Player Info */}
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-lg mr-2">{player.name}</h3>
                    {player.isCPU && (
                      <span className="text-xs px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full">
                        CPU
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-sm">
                    <span className={`${status.color} mr-2`}>{status.icon}</span>
                    <span className={status.color}>{status.text}</span>
                  </div>
                </div>

                {/* Card Count and Hand Visualization */}
                <div className="text-right">
                  <div className="font-semibold text-lg mb-1">{cardCount}</div>

                  {/* Visual representation of cards */}
                  <div className="flex justify-end space-x-1">
                    {Array.from({ length: Math.min(player.hand?.length || 0, 8) }).map((_, index) => (
                      <div
                        key={index}
                        className={`
                          w-2 h-3 rounded-sm transition-all duration-200
                          ${player.isEliminated
                            ? 'bg-red-400/50'
                            : currentPlayer === player.id
                              ? 'bg-yellow-400/80'
                              : 'bg-blue-400/60'
                          }
                        `}
                      />
                    ))}
                    {(player.hand?.length || 0) > 8 && (
                      <div className="text-xs opacity-70 ml-1">
                        +{(player.hand?.length || 0) - 8}
                      </div>
                    )}
                  </div>

                  {/* Additional status indicators */}
                  <div className="text-xs opacity-70 mt-1">
                    {player.isEliminated ? (
                      <span className="text-red-400">Game Over</span>
                    ) : currentPlayer === player.id ? (
                      <span className="text-yellow-400">Playing...</span>
                    ) : (
                      <span>Thinking...</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional player stats */}
              {!player.isEliminated && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex justify-between text-xs opacity-70">
                    <span>Hand Size</span>
                    <span className="font-semibold">{player.hand?.length || 0}</span>
                  </div>
                </div>
              )}

              {/* Elimination reason (if eliminated) */}
              {player.isEliminated && (
                <div className="mt-2 pt-2 border-t border-red-400/30">
                  <div className="text-xs text-red-300 opacity-80">
                    💥 Exploded by Exploding Kitten
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="text-center">
            <div className="text-lg font-bold">
              {otherPlayers.filter(p => !p.isEliminated).length}
            </div>
            <div className="opacity-70">Alive</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">
              {otherPlayers.filter(p => p.isEliminated).length}
            </div>
            <div className="opacity-70">Eliminated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherPlayers;