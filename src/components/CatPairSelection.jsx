/**
 * CatPairSelection Component
 * 
 * Shows a modal-style interface for selecting which player to target
 * with cat pair attacks and then selecting a card from their hand.
 */

import { useState } from 'react';

const CatPairSelection = ({ 
  catPair,
  players, 
  currentPlayerID, 
  onSelectTarget, 
  onCancel
}) => {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [showCardSelection, setShowCardSelection] = useState(false);

  console.log('CatPairSelection render:', {
    catPair,
    playersCount: Object.keys(players || {}).length,
    currentPlayerID,
    selectedTarget
  });

  // Get all valid target players (alive, not current player, have cards)
  const validTargets = Object.values(players || {}).filter(player => 
    player.id !== parseInt(currentPlayerID) && 
    !player.isEliminated && 
    player.hand.length > 0
  );

  const handleTargetSelect = (targetPlayerID) => {
    console.log('Target selected for cat pair:', targetPlayerID);
    setSelectedTarget(targetPlayerID);
    setShowCardSelection(true);
  };

  const handleCardSelect = (cardIndex) => {
    console.log('Card selected from target:', cardIndex);
    onSelectTarget(selectedTarget, cardIndex);
  };

  const handleBack = () => {
    setSelectedTarget(null);
    setShowCardSelection(false);
  };

  if (validTargets.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
          <h3 className="text-xl font-bold text-red-600 mb-4">No Valid Targets</h3>
          <p className="text-gray-700 mb-4">
            No other players have cards to steal.
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

  if (showCardSelection && selectedTarget !== null) {
    const targetPlayer = players[selectedTarget];
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl mx-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Select Card from {targetPlayer.name}
            </h3>
            <p className="text-gray-600">
              Choose a card to steal (you won't see what it is until you take it!)
            </p>
          </div>

          {/* Card Backs Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 mb-6">
            {Array.from({ length: targetPlayer.hand.length }, (_, index) => (
              <button
                key={index}
                onClick={() => handleCardSelect(index)}
                className="
                  aspect-[2/3] bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg
                  flex items-center justify-center text-white font-bold text-lg
                  hover:shadow-xl hover:scale-105 transition-all duration-200
                  focus:outline-none
                "
              >
                🎴
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleBack}
              className="bg-gray-500 text-white font-bold py-2 px-6 rounded hover:bg-gray-600 transition-colors"
            >
              ← Back to Player Selection
            </button>
            <button
              onClick={onCancel}
              className="bg-red-500 text-white font-bold py-2 px-6 rounded hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Play Cat Pair</h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">{catPair.emoji}</span>
            <span className="text-xl font-bold text-gray-700">{catPair.catName}</span>
            <span className="text-3xl">{catPair.emoji}</span>
          </div>
          <p className="text-gray-600">Choose which player to steal a random card from:</p>
        </div>

        {/* Player Selection Grid */}
        <div className="grid gap-3 mb-6">
          {validTargets.map(player => (
            <button
              key={player.id}
              onClick={() => handleTargetSelect(player.id)}
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

export default CatPairSelection;