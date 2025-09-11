/**
 * PlayerTargetSelection Component
 * 
 * Shows a modal-style interface for selecting which player to target
 * with Favor cards or other targeted actions.
 */

const PlayerTargetSelection = ({
  players,
  currentPlayerID,
  onSelectTarget,
  onCancel,
  title = "Choose Player to Target",
  description = "Select which player you want to target:"
}) => {
  console.log('PlayerTargetSelection render:', {
    playersCount: Object.keys(players || {}).length,
    currentPlayerID,
    title
  });

  // Get all valid target players (alive, not current player, have cards)
  const validTargets = Object.values(players || {}).filter(player =>
    player.id !== parseInt(currentPlayerID) &&
    !player.isEliminated &&
    player.hand.length > 0
  );

  console.log('Valid targets:', validTargets.map(p => ({ id: p.id, name: p.name, cards: p.hand.length })));

  if (validTargets.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
          <h3 className="text-xl font-bold text-red-600 mb-4">No Valid Targets</h3>
          <p className="text-gray-700 mb-4">
            No other players have cards to target.
          </p>
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Player Selection Grid */}
        <div className="grid gap-3 mb-6">
          {validTargets.map(player => (
            <button
              key={player.id}
              onClick={() => onSelectTarget(player.id)}
              className="
                flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg
                hover:border-blue-500 hover:bg-blue-50 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              "
            >
              <div className="flex items-center gap-3">
                {/* Player Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {player.isCPU ? '🤖' : '👤'}
                </div>

                {/* Player Info */}
                <div className="text-left">
                  <div className="font-bold text-gray-800">{player.name}</div>
                  <div className="text-sm text-gray-600">
                    {player.hand.length} card{player.hand.length === 1 ? '' : 's'}
                    {player.isCPU && <span className="ml-2 text-blue-600">CPU</span>}
                  </div>
                </div>
              </div>

              {/* Selection Arrow */}
              <div className="text-blue-500 text-xl">
                👉
              </div>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="text-center">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerTargetSelection;