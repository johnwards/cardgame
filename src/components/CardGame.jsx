const CardGame = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8 drop-shadow-lg">
          🃏 Hello Card Game! 🃏
        </h1>
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome to Exploding Kittens Clone
          </h2>
          <p className="text-gray-600 mb-6">
            A thrilling card game where you try to avoid exploding kittens and be the last player standing!
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">💥</div>
              <div className="text-sm font-medium text-red-800">Exploding Cards</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="text-sm font-medium text-blue-800">Defuse Cards</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm font-medium text-yellow-800">Action Cards</div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🐱</div>
              <div className="text-sm font-medium text-purple-800">Cat Cards</div>
            </div>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg">
            Start New Game
          </button>
        </div>
        <div className="mt-8 text-white/80">
          <p className="text-sm">
            Built with React + Vite + Tailwind CSS + boardgame.io
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardGame;