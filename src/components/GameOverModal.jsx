const GameOverModal = ({ isVisible, winner, winnerName, reason, onNewGame }) => {
  if (!isVisible) return null;

  // Debug logging
  console.log('GameOverModal props:', { isVisible, winner, winnerName, reason });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 max-w-md w-full text-white text-center shadow-2xl">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
        </div>

        {winner !== undefined && (
          <div className="mb-6">
            <div className="text-2xl mb-2">
              <span className="text-yellow-300">🏆 Winner: </span>
              <span className="font-bold text-yellow-100">
                {winnerName || `Player ${winner}`}
              </span>
            </div>
            {reason && (
              <p className="text-lg opacity-90 bg-white/10 rounded-lg p-3 mt-3">
                {reason}
              </p>
            )}
          </div>
        )}

        <div className="mb-6">
          <div className="text-lg opacity-80">
            Thanks for playing! 🐱💥
          </div>
        </div>

        <button
          onClick={onNewGame}
          className="bg-white text-purple-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-200 shadow-lg text-lg"
        >
          🎮 Start New Game
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;