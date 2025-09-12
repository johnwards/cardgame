const GameStatus = ({
  currentPlayer,
  players,
  playerID,
  isActive,
  turn,
  lastAction,
  hasPendingExplodingKitten = false,
  gamePhase = 'playing',
  turnsRemaining = {}
}) => {
  const currentPlayerInfo = players[currentPlayer];

  const isHumanTurn = currentPlayer === playerID;

  const alivePlayers = Object.values(players).filter(p => !p.isEliminated);
  const eliminatedPlayers = Object.values(players).filter(p => p.isEliminated);

  const getStatusMessage = () => {
    if (hasPendingExplodingKitten) {
      return {
        message: "Place the Exploding Kitten back in the deck!",
        type: "danger",
        icon: "💥"
      };
    }

    // Handle multiple turns from attack cards
    const humanTurnsRemaining = turnsRemaining[playerID] || 1;
    const hasMultipleTurns = humanTurnsRemaining > 1;

    if (isHumanTurn && isActive) {
      if (hasMultipleTurns) {
        return {
          message: `Your turn! You have ${humanTurnsRemaining} turns left (thanks to that attack!)`,
          type: "attacked",
          icon: "⚔️"
        };
      }
      return {
        message: "Your turn! Play cards or draw to end your turn.",
        type: "active",
        icon: "⚡"
      };
    }

    if (isHumanTurn && !isActive) {
      return {
        message: "Waiting for your input...",
        type: "waiting",
        icon: "⏳"
      };
    }

    if (currentPlayerInfo?.isCPU) {
      return {
        message: `${currentPlayerInfo.name} is thinking...`,
        type: "cpu",
        icon: "🤖"
      };
    }

    return {
      message: `Waiting for ${currentPlayerInfo?.name || 'player'}...`,
      type: "neutral",
      icon: "👥"
    };
  };

  const status = getStatusMessage();

  const getStatusStyling = (type) => {
    switch (type) {
      case 'active':
        return 'bg-green-500 text-white border-green-400 shadow-lg shadow-green-500/30';
      case 'attacked':
        return 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/30 animate-pulse';
      case 'danger':
        return 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/30 animate-pulse';
      case 'waiting':
        return 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/30';
      case 'cpu':
        return 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/30';
      default:
        return 'bg-gray-500 text-white border-gray-400';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
      {/* Turn Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">Game Status</h3>
        <div className="text-lg opacity-80">Turn {turn}</div>
      </div>

      {/* Current Player Indicator */}
      <div className="text-center mb-6">
        <div className={`
          inline-flex items-center px-6 py-4 rounded-full font-bold text-lg border-2 transition-all duration-300
          ${getStatusStyling(status.type)}
        `}>
          <span className="mr-3 text-2xl">{status.icon}</span>
          <div className="text-center">
            <div className="font-bold">
              {isHumanTurn ? 'Your Turn!' : `${currentPlayerInfo?.name || 'Unknown'}'s Turn`}
            </div>
            <div className="text-sm opacity-90 mt-1">
              {status.message}
            </div>
          </div>
          {isActive && isHumanTurn && (
            <span className="ml-3 animate-pulse text-2xl">⚡</span>
          )}
        </div>
      </div>

      {/* Last Action Display */}
      {lastAction && (
        <div className="text-center mb-6">
          <div className="bg-white/20 rounded-lg p-3 border border-white/30">
            <div className="text-sm opacity-80 mb-1">Last Action</div>
            <div className="font-semibold">{lastAction}</div>
          </div>
        </div>
      )}

      {/* Game Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
            <div className="text-2xl font-bold text-green-300">{alivePlayers.length}</div>
            <div className="text-sm opacity-80">Players Alive</div>
          </div>
        </div>
        <div className="text-center">
          <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
            <div className="text-2xl font-bold text-red-300">{eliminatedPlayers.length}</div>
            <div className="text-sm opacity-80">Players Eliminated</div>
          </div>
        </div>
      </div>

      {/* Player Turn Order */}
      <div className="mb-6">
        <h4 className="text-lg font-bold mb-3 text-center">Turn Order</h4>
        <div className="space-y-2">
          {Object.values(players).map((player) => (
            <div
              key={player.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                ${player.id === currentPlayer
                  ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200'
                  : player.isEliminated
                    ? 'bg-red-500/10 border-red-500/30 text-red-300 opacity-60'
                    : 'bg-white/10 border-white/20'
                }
              `}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  {player.id === currentPlayer ? '▶️' : player.isEliminated ? '💀' : '⏳'}
                </span>
                <span className="font-semibold">{player.name}</span>
                {player.isCPU && (
                  <span className="ml-2 text-xs px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full">
                    CPU
                  </span>
                )}
              </div>
              <div className="text-sm">
                {player.isEliminated ? (
                  <span className="text-red-400">Eliminated</span>
                ) : player.id === currentPlayer ? (
                  <span className="text-yellow-400 font-bold">Playing</span>
                ) : (
                  <span className="opacity-70">Waiting</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Status Messages */}
      {hasPendingExplodingKitten && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
          <div className="text-red-300 font-bold mb-2">⚠️ Urgent Action Required!</div>
          <div className="text-sm text-red-200">
            You must place the Exploding Kitten back in the deck before continuing.
          </div>
        </div>
      )}

      {gamePhase !== 'playing' && (
        <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 text-center">
          <div className="text-blue-300 font-bold mb-2">🔄 Game Phase</div>
          <div className="text-sm text-blue-200 capitalize">
            {gamePhase}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {isHumanTurn && !hasPendingExplodingKitten && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-center text-xs opacity-70">
            💡 Tip: You can play multiple cards before drawing to end your turn
          </div>
        </div>
      )}
    </div>
  );
};

export default GameStatus;