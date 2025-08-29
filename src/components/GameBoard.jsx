/**
 * Simple GameBoard Component for debugging
 * This minimal version will help identify what's causing the error
 */

const GameBoard = ({ G, ctx, moves, playerID, isActive }) => {
  // Simple error checking and debugging
  console.log('GameBoard props:', { G, ctx, moves, playerID, isActive });

  // Basic null checks
  if (!G) {
    return <div className="p-8 text-red-600">Error: Game state (G) is null or undefined</div>;
  }

  if (!ctx) {
    return <div className="p-8 text-red-600">Error: Game context (ctx) is null or undefined</div>;
  }

  if (!G.players) {
    return <div className="p-8 text-red-600">Error: G.players is null or undefined</div>;
  }

  if (!moves) {
    return <div className="p-8 text-red-600">Error: moves is null or undefined</div>;
  }

  // Get current player safely
  const currentPlayer = G.players[ctx.currentPlayer];
  const humanPlayer = G.players[playerID];

  if (!currentPlayer) {
    return <div className="p-8 text-red-600">Error: currentPlayer is null or undefined</div>;
  }

  if (!humanPlayer) {
    return <div className="p-8 text-red-600">Error: humanPlayer is null or undefined</div>;
  }

  // Simple render
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Exploding Kittens Debug</h1>

        <div className="space-y-4">
          <div>
            <strong>Current Player:</strong> {currentPlayer.name} (ID: {ctx.currentPlayer})
          </div>

          <div>
            <strong>Your Player:</strong> {humanPlayer.name} (ID: {playerID})
          </div>

          <div>
            <strong>Is Your Turn:</strong> {ctx.currentPlayer === playerID ? 'Yes' : 'No'}
          </div>

          <div>
            <strong>Is Active:</strong> {isActive ? 'Yes' : 'No'}
          </div>

          <div>
            <strong>Deck Size:</strong> {G.deck ? G.deck.length : 'undefined'}
          </div>

          <div>
            <strong>Your Hand Size:</strong> {humanPlayer.hand ? humanPlayer.hand.length : 'undefined'}
          </div>

          <div>
            <strong>Game Phase:</strong> {ctx.phase || 'undefined'}
          </div>

          <div>
            <strong>Turn:</strong> {ctx.turn}
          </div>

          {ctx.gameover && (
            <div className="bg-red-500 p-4 rounded">
              <strong>Game Over:</strong> {JSON.stringify(ctx.gameover)}
            </div>
          )}

          {/* Simple action buttons */}
          {ctx.currentPlayer === playerID && isActive && !ctx.gameover && (
            <div className="space-x-4">
              <button
                onClick={() => {
                  console.log('Draw button clicked');
                  if (moves.drawCard) {
                    moves.drawCard();
                  } else {
                    console.error('drawCard move not available');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Draw Card
              </button>

              {humanPlayer.hand && humanPlayer.hand.length > 0 && (
                <button
                  onClick={() => {
                    console.log('Play card button clicked');
                    if (moves.playCard) {
                      moves.playCard(0); // Play first card
                    } else {
                      console.error('playCard move not available');
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Play First Card
                </button>
              )}
            </div>
          )}

          {/* Debug info */}
          <details className="mt-8">
            <summary className="cursor-pointer text-yellow-300">Debug Info (Click to expand)</summary>
            <div className="mt-4 p-4 bg-black/20 rounded text-xs">
              <div className="mb-2">
                <strong>G:</strong>
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(G, null, 2)}
                </pre>
              </div>
              <div className="mb-2">
                <strong>ctx:</strong>
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(ctx, null, 2)}
                </pre>
              </div>
              <div>
                <strong>moves:</strong>
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(Object.keys(moves || {}), null, 2)}
                </pre>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;