/**
 * Main GameBoard Component - boardgame.io Integration
 * 
 * Implements Task 3.1: Core React component integrated with boardgame.io Client
 * Enhanced for Task 3.2: Player Hand and Card Interaction Components
 * - Receives {G, ctx, moves, playerID, isActive} props from boardgame.io
 * - Displays game state using G.players, G.deck.length, G.discardPile
 * - Shows turn indicator using ctx.currentPlayer and isActive prop
 * - Handles game over display with ctx.gameover.winner information
 * - Uses Tailwind CSS for responsive layout and styling
 * - Integrates PlayerHand and OtherPlayers components for better organization
 */

import PlayerHand from './PlayerHand';
import OtherPlayers from './OtherPlayers';

const GameBoard = ({ G, ctx, moves, playerID, isActive }) => {
  // Debug logging to understand the issue
  console.log('GameBoard render - playerID:', playerID);
  console.log('GameBoard render - G.players:', G?.players);
  console.log('GameBoard render - G.players keys:', Object.keys(G?.players || {}));
  console.log('GameBoard render - ctx.currentPlayer:', ctx?.currentPlayer);
  console.log('GameBoard render - ctx.numPlayers:', ctx?.numPlayers);

  // Comprehensive error handling
  if (!G) {
    return (
      <div className="p-8 text-red-600">
        <div>Error: Game state (G) is null or undefined</div>
        <div>Props received: {JSON.stringify({ G, ctx, moves, playerID, isActive }, null, 2)}</div>
      </div>
    );
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

  // Get player references safely
  const currentPlayer = G.players[ctx.currentPlayer];
  const humanPlayer = G.players[playerID];

  if (!currentPlayer) {
    return <div className="p-8 text-red-600">Error: currentPlayer is null or undefined</div>;
  }

  if (!humanPlayer) {
    return <div className="p-8 text-red-600">Error: humanPlayer is null or undefined</div>;
  }

  // Check if human player has pending exploding kitten placement
  const hasPendingExplodingKitten = G.secret?.pendingExplodingKitten &&
    G.secret?.pendingExplodingKittenPlayer === playerID;

  // No longer need helper functions - moved to component-specific files

  // Handle exploding kitten placement
  const handleExplodingKittenPlacement = (position) => {
    if (moves.placeExplodingKitten && hasPendingExplodingKitten) {
      moves.placeExplodingKitten(position);
    }
  };

  // Render exploding kitten placement modal
  const renderPlacementModal = () => {
    if (!hasPendingExplodingKitten) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            💥 Place Exploding Kitten Back in Deck
          </h3>
          <p className="text-gray-600 mb-6">
            You defused the Exploding Kitten! Choose where to place it back in the deck:
          </p>
          <div className="space-y-3">
            <button
              onClick={() => handleExplodingKittenPlacement(0)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded"
            >
              Top of Deck (Most Dangerous)
            </button>
            <button
              onClick={() => handleExplodingKittenPlacement(Math.floor(G.deck.length / 2))}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded"
            >
              Middle of Deck
            </button>
            <button
              onClick={() => handleExplodingKittenPlacement(G.deck.length)}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded"
            >
              Bottom of Deck (Safest)
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 text-white">
          <h1 className="text-4xl font-bold text-center mb-2">💥 Exploding Kittens 💥</h1>
          <div className="text-center">
            <span className="text-lg">Turn {ctx.turn}</span>
            {G.lastAction && (
              <span className="ml-4 text-yellow-300">• {G.lastAction}</span>
            )}
          </div>
        </div>

        {/* Game Over Display */}
        {ctx.gameover && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 mb-6 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">🎉 Game Over! 🎉</h2>
            {ctx.gameover.winner && (
              <div>
                <p className="text-xl mb-2">
                  Winner: <span className="font-bold">{ctx.gameover.winnerName || `Player ${ctx.gameover.winner}`}</span>
                </p>
                <p className="text-lg opacity-90">{ctx.gameover.reason}</p>
              </div>
            )}
            {ctx.gameover.draw && (
              <div>
                <p className="text-xl mb-2">It's a Draw!</p>
                <p className="text-lg opacity-90">{ctx.gameover.reason}</p>
                {ctx.gameover.winners && (
                  <p className="mt-2">
                    Survivors: {ctx.gameover.winners.map(w => w.name).join(', ')}
                  </p>
                )}
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-white text-purple-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              New Game
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Other Players Panel */}
          <div className="lg:col-span-1">
            <OtherPlayers
              players={G.players}
              currentPlayer={ctx.currentPlayer}
              playerID={playerID}
            />
          </div>

          {/* Game Area */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Draw Pile */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Draw Pile</h3>
                  <div className="bg-blue-600 rounded-lg p-6 min-h-32 flex items-center justify-center">
                    <div>
                      <div className="text-4xl mb-2">🎴</div>
                      <div className="font-bold text-lg">{G.deck?.length || 0} cards</div>
                    </div>
                  </div>
                </div>

                {/* Discard Pile */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">Discard Pile</h3>
                  <div className="bg-gray-600 rounded-lg p-6 min-h-32 flex items-center justify-center">
                    <div>
                      {G.discardPile?.length > 0 ? (
                        <>
                          <div className="text-4xl mb-2">
                            {G.discardPile[G.discardPile.length - 1].emoji}
                          </div>
                          <div className="font-bold text-sm">
                            {G.discardPile[G.discardPile.length - 1].name}
                          </div>
                          <div className="text-xs opacity-80">
                            {G.discardPile.length} cards
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-4xl mb-2 opacity-50">🗑️</div>
                          <div className="font-bold text-sm opacity-50">Empty</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Turn Indicator */}
              <div className="text-center mb-6">
                <div className={`inline-block px-6 py-3 rounded-full font-bold text-lg ${ctx.currentPlayer === playerID
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-500 text-white'
                  }`}>
                  {ctx.currentPlayer === playerID ? "Your Turn!" : `${currentPlayer.name}'s Turn`}
                  {isActive && ctx.currentPlayer === playerID && (
                    <span className="ml-2 animate-pulse">⚡</span>
                  )}
                </div>
              </div>

              {/* Pending Exploding Kitten Message */}
              {hasPendingExplodingKitten && (
                <div className="text-center">
                  <div className="bg-red-500 text-white p-4 rounded-lg">
                    <p className="font-bold">💥 You drew an Exploding Kitten!</p>
                    <p>You defused it! Now choose where to place it back in the deck.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Player Hand Component */}
            <div className="mt-6">
              <PlayerHand
                player={humanPlayer}
                isActive={isActive}
                isCurrentPlayer={ctx.currentPlayer === playerID}
                canPlayCards={!ctx.gameover && !hasPendingExplodingKitten}
                canDrawCard={!ctx.gameover && !hasPendingExplodingKitten}
                moves={moves}
                deckCount={G.deck?.length || 0}
                hasPendingExplodingKitten={hasPendingExplodingKitten}
              />
            </div>
          </div>
        </div>

        {/* Debug Panel (Development Mode) */}
        {import.meta.env.DEV && (
          <details className="mt-6 bg-black/20 backdrop-blur-sm rounded-lg p-4 text-white">
            <summary className="cursor-pointer text-yellow-300 font-bold">
              🛠️ Debug Information (Click to expand)
            </summary>
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <strong>Game State (G):</strong>
                <pre className="bg-black/30 p-2 rounded mt-1 overflow-auto max-h-32">
                  {JSON.stringify({
                    deckLength: G.deck?.length,
                    discardPileLength: G.discardPile?.length,
                    players: Object.fromEntries(
                      Object.entries(G.players || {}).map(([id, player]) => [
                        id,
                        {
                          name: player.name,
                          handSize: player.hand?.length,
                          isEliminated: player.isEliminated,
                          isCPU: player.isCPU
                        }
                      ])
                    ),
                    hasPendingExplodingKitten: !!G.secret?.pendingExplodingKitten
                  }, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Context (ctx):</strong>
                <pre className="bg-black/30 p-2 rounded mt-1 overflow-auto max-h-32">
                  {JSON.stringify({
                    turn: ctx.turn,
                    currentPlayer: ctx.currentPlayer,
                    phase: ctx.phase,
                    gameover: ctx.gameover,
                    playerID,
                    isActive
                  }, null, 2)}
                </pre>
              </div>
              <div>
                <strong>Available Moves:</strong>
                <pre className="bg-black/30 p-2 rounded mt-1">
                  {JSON.stringify(Object.keys(moves || {}), null, 2)}
                </pre>
              </div>
            </div>
          </details>
        )}
      </div>

      {/* Exploding Kitten Placement Modal */}
      {renderPlacementModal()}
    </div>
  );
};

export default GameBoard;
