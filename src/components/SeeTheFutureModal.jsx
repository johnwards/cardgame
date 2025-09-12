/**
 * SeeTheFutureModal Component
 * 
 * Shows the top 3 cards of the deck to the human player when they play a See the Future card.
 * AI players don't see this - they get no benefit from the card.
 */

const SeeTheFutureModal = ({ futureCards, onDismiss }) => {
  if (!futureCards || futureCards.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🔮 See the Future
          </h2>
          <p className="text-gray-600">
            These are the next {futureCards.length} cards that will be drawn (in order):
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {futureCards.map((card, index) => (
            <div
              key={card.id}
              className={`
                flex items-center gap-4 p-3 rounded-lg border-2
                ${card.type === 'exploding'
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : card.type === 'defuse'
                    ? 'bg-green-50 border-green-300 text-green-800'
                    : 'bg-gray-50 border-gray-300 text-gray-800'
                }
              `}
            >
              <div className="flex-shrink-0">
                <div className="text-xs font-bold bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
              <div className="text-3xl">{card.emoji}</div>
              <div className="flex-grow">
                <div className="font-bold">{card.name}</div>
                <div className="text-sm opacity-70">{card.description}</div>
              </div>
              {card.type === 'exploding' && (
                <div className="text-red-600 font-bold text-sm">
                  ⚠️ DANGER!
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={onDismiss}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Got it! 👍
          </button>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          💡 The first card shown will be drawn next, then the second, then the third.
        </div>
      </div>
    </div>
  );
};

export default SeeTheFutureModal;