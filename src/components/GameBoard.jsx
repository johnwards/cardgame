import PlayerHand from './PlayerHand';
import SeeTheFutureModal from './SeeTheFutureModal';
import GameOverModal from './GameOverModal';

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
        {/* Game Over Modal */}
        <GameOverModal
          isVisible={!!ctx.gameover}
          winner={ctx.gameover?.winner}
          winnerName={ctx.gameover?.winnerName}
          reason={ctx.gameover?.reason}
          onNewGame={() => window.location.reload()}
        />

        {/* See the Future Modal */}
        {G.seeTheFutureCards && G.seeTheFuturePlayer === playerID && (
          <SeeTheFutureModal
            futureCards={G.seeTheFutureCards}
            onDismiss={() => moves.dismissSeeTheFuture()}
          />
        )}

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Other Players Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-4">Other Players</h2>
              {Object.values(G.players).filter(p => p.id !== parseInt(playerID)).map(player => (
                <div
                  key={player.id}
                  className={`mb-4 p-3 rounded transition-all duration-300 ${ctx.currentPlayer == player.id
                    ? 'bg-yellow-500/30 border-2 border-yellow-400'
                    : 'bg-white/10'
                    }`}
                >
                  <div className="font-bold flex items-center gap-2">
                    {player.name}
                    {player.isCPU && <span className="text-xs bg-blue-500 px-2 py-1 rounded">🤖 CPU</span>}
                  </div>
                  <div className="text-sm">Cards: {player.hand?.length || 0}</div>
                  <div className="text-sm">
                    Status: {player.isEliminated ? '💀 Eliminated' : '✅ Alive'}
                  </div>
                  {ctx.currentPlayer == player.id && !player.isEliminated && (
                    <div className="text-sm text-yellow-300 animate-pulse">
                      {player.isCPU ? '🤖 CPU Thinking...' : '⚡ Current Turn'}
                    </div>
                  )}
                  {G.pendingExplodingKitten && G.pendingPlayer === player.id && (
                    <div className="text-sm text-orange-300 animate-pulse">
                      💥 Placing Exploding Kitten...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Game Area and Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Status Messages */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Game Area</h2>

              {/* Current turn indicator */}
              <div className="mb-4 p-3 bg-blue-600/50 rounded-lg">
                <div className="font-bold">Current Turn: {currentPlayer.name}</div>
                {currentPlayer.isCPU && (
                  <div className="text-sm animate-pulse">🤖 CPU is deciding...</div>
                )}
                {!currentPlayer.isCPU && ctx.currentPlayer === playerID && (
                  <div className="text-sm text-green-300">✨ Your turn! Play cards or draw.</div>
                )}
              </div>

              {/* Special status messages */}
              {G.pendingExplodingKitten && G.pendingPlayer === playerID && (
                <div className="mb-4 p-3 bg-orange-600 rounded-lg">
                  <div className="font-bold">🛡️ DEFUSE USED!</div>
                  <div className="text-sm">You used a defuse card and survived the exploding kitten!</div>
                  <div className="text-sm">Now choose where to place it back in the deck.</div>
                </div>
              )}

              {G.pendingExplodingKitten && G.pendingPlayer !== playerID && (
                <div className="mb-4 p-3 bg-orange-600/70 rounded-lg">
                  <div className="font-bold">🛡️ {G.players[G.pendingPlayer]?.name} DEFUSED!</div>
                  <div className="text-sm">They used a defuse card and are placing the exploding kitten back in the deck...</div>
                </div>
              )}

              {/* Pending Favor - Human player needs to give a card */}
              {G.pendingFavor && G.favorTarget === playerID && (
                <div className="mb-4 p-3 bg-purple-600 rounded-lg">
                  <div className="font-bold">🤝 FAVOR REQUEST!</div>
                  <div className="text-sm">{G.players[G.pendingFavor]?.name} played a Favor card on you!</div>
                  <div className="text-sm">Choose a card from your hand to give them (look below).</div>
                </div>
              )}

              {/* Pending Favor - Someone else needs to give a card */}
              {G.pendingFavor && G.favorTarget !== playerID && (
                <div className="mb-4 p-3 bg-purple-600/70 rounded-lg">
                  <div className="font-bold">🤝 FAVOR IN PROGRESS</div>
                  <div className="text-sm">{G.players[G.pendingFavor]?.name} is waiting for {G.players[G.favorTarget]?.name} to give them a card...</div>
                </div>
              )}

              {/* Check if human player was recently eliminated */}
              {humanPlayer.isEliminated && (
                <div className="mb-4 p-3 bg-red-600 rounded-lg">
                  <div className="font-bold">💀 YOU WERE ELIMINATED!</div>
                  <div className="text-sm">You drew an exploding kitten without a defuse card!</div>
                  <div className="text-xs mt-1">Watch the remaining players battle it out!</div>
                </div>
              )}

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
              hasPendingExplodingKitten={G.pendingExplodingKitten && G.pendingPlayer === playerID}
              players={G.players} // Pass all players for target selection
              gameState={G} // Pass game state for favor handling
            />

            {/* Exploding Kitten Placement Interface */}
            {G.pendingExplodingKitten && G.pendingPlayer === playerID && (
              <div className="bg-red-600/90 backdrop-blur-sm rounded-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4 text-center">💥 Place Exploding Kitten 💥</h3>
                <p className="text-center mb-4">You defused an Exploding Kitten! Choose where to place it back in the deck:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => moves.placeExplodingKitten(0)}
                    className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                  >
                    🔥 Top (Next Player Gets It!)
                  </button>
                  <button
                    onClick={() => moves.placeExplodingKitten(Math.floor(G.deck.length / 2))}
                    className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                  >
                    🎯 Middle of Deck
                  </button>
                  <button
                    onClick={() => moves.placeExplodingKitten(G.deck.length)}
                    className="bg-white text-red-600 font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                  >
                    🛡️ Bottom (Safest)
                  </button>
                </div>
              </div>
            )}
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
