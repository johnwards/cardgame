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
import GameArea from './GameArea';
import GameStatus from './GameStatus';
import ExplodingKittenPlacement from './ExplodingKittenPlacement';

const GameBoard = ({ G, ctx, moves, playerID, isActive }) => {
  // Debug logging to understand the issue
  console.log('GameBoard render - SIMPLIFIED DEBUG');
  console.log('playerID:', playerID);
  console.log('ctx.currentPlayer:', ctx?.currentPlayer);
  console.log('isActive:', isActive);
  console.log('G.players keys:', Object.keys(G?.players || {}));
  console.log('moves available:', Object.keys(moves || {}));
  console.log('G.deck length:', G?.deck?.length);

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

  console.log('currentPlayer found:', !!currentPlayer, currentPlayer?.name);
  console.log('humanPlayer found:', !!humanPlayer, humanPlayer?.name);

  if (!currentPlayer) {
    return <div className="p-8 text-red-600">Error: currentPlayer is null or undefined</div>;
  }

  if (!humanPlayer) {
    return <div className="p-8 text-red-600">Error: humanPlayer is null or undefined</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-blue-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Game Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 text-white">
          <h1 className="text-4xl font-bold text-center mb-2">💥 Exploding Kittens 💥</h1>
          <div className="text-center">
            <span className="text-lg">Turn {ctx.turn}</span>
            <div className="text-sm mt-2">Current Player: {currentPlayer.name}</div>
            <div className="text-sm">Your PlayerID: {playerID}</div>
            <div className="text-sm">Is Your Turn: {ctx.currentPlayer === playerID ? 'YES' : 'NO'}</div>
            <div className="text-sm">Is Active: {isActive ? 'YES' : 'NO'}</div>
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
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-4">Other Players</h2>
              {Object.values(G.players).filter(p => p.id !== parseInt(playerID)).map(player => (
                <div key={player.id} className="mb-4 p-3 bg-white/10 rounded">
                  <div className="font-bold">{player.name}</div>
                  <div className="text-sm">Cards: {player.hand?.length || 0}</div>
                  <div className="text-sm">Status: {player.isEliminated ? '💀 Eliminated' : '✅ Alive'}</div>
                  {ctx.currentPlayer == player.id && <div className="text-sm text-yellow-300">⚡ Current Turn</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Game Area and Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Area */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Game Area</h2>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎴</div>
                  <div className="font-bold">Draw Pile</div>
                  <div className="text-sm">{G.deck?.length || 0} cards</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🗂️</div>
                  <div className="font-bold">Discard Pile</div>
                  <div className="text-sm">{G.discardPile?.length || 0} cards</div>
                  {G.discardPile?.length > 0 && (
                    <div className="text-xs mt-1">Top: {G.discardPile[G.discardPile.length - 1]?.name}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Player Hand Component */}
            <PlayerHand
              player={humanPlayer}
              isActive={isActive}
              isCurrentPlayer={ctx.currentPlayer === playerID}
              canPlayCards={!ctx.gameover}
              canDrawCard={!ctx.gameover}
              moves={moves}
              deckCount={G.deck?.length || 0}
              hasPendingExplodingKitten={false}
            />
          </div>
        </div>

        {/* Debug Panel (Development Mode) */}
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
                  )
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
      </div>
    </div>
  );
};

export default GameBoard;
