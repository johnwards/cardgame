import PlayerHand from './PlayerHand';
import SeeTheFutureModal from './SeeTheFutureModal';
import GameOverModal from './GameOverModal';
import AttackNotification from './AttackNotification';

import { setGlobalSelectedFavorCard } from '../game/index';

const GameBoard = ({ G, ctx, moves, playerID, isActive }) => {

  console.log('GameBoard render - SIMPLIFIED DEBUG');
  console.log('playerID:', playerID);
  console.log('ctx.currentPlayer:', ctx?.currentPlayer);
  console.log('isActive:', isActive);
  console.log('G.players keys:', Object.keys(G?.players || {}));
  console.log('moves available:', Object.keys(moves || {}));
  console.log('G.deck length:', G?.deck?.length);

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

  const handleGiveFavorCard = (cardIndex) => {
    console.log('=== STORING SELECTED FAVOR CARD ===');
    console.log('cardIndex:', cardIndex);
    setGlobalSelectedFavorCard(cardIndex);
    console.log('Card stored in global variable, waitingForFavor will pick it up');
  };

  const shouldShowAttackNotification = G.attackNotification &&
    G.attackNotification.targetPlayer === parseInt(playerID);

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-400 to-cyan-500 overflow-hidden">
      {/* Modals */}
      <GameOverModal
        isVisible={!!ctx.gameover}
        winner={ctx.gameover?.winner}
        winnerName={ctx.gameover?.winnerName}
        reason={ctx.gameover?.reason}
        onNewGame={() => window.location.reload()}
      />

      <AttackNotification
        isVisible={shouldShowAttackNotification}
        attackerName={G.attackNotification?.attackerName}
        remainingTurns={G.attackNotification?.remainingTurns}
        onDismiss={() => moves.dismissAttackNotification()}
      />

      {G.seeTheFutureCards && G.seeTheFuturePlayer === playerID && (
        <SeeTheFutureModal
          futureCards={G.seeTheFutureCards}
          onDismiss={() => moves.dismissSeeTheFuture()}
        />
      )}

      {/* Compact Top Header */}
      <div className="bg-white/20 backdrop-blur-md text-white px-2 md:px-6 py-2 md:py-4 border-b border-white/20 shadow-lg mobile-header">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 md:gap-2 lg:gap-4">
            <h1 className="text-lg md:text-xl lg:text-2xl font-black tracking-wide text-white drop-shadow-lg">💥 EXPLODING KITTENS 💥</h1>
            <div className="bg-white/20 backdrop-blur-sm px-1 md:px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold border border-white/30">
              Turn {ctx.turn}
            </div>
          </div>
          <div className="text-right text-xs lg:text-sm">
            <div className="font-bold text-white drop-shadow">Current: {currentPlayer.name}</div>
            <div className={ctx.currentPlayer === playerID ? 'text-green-200 font-bold' : 'text-gray-200'}>
              {ctx.currentPlayer === playerID ? '⚡ YOUR TURN!' : '⏳ Waiting...'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Layout */}
      <div className="flex h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">

        {/* Left Sidebar - CPU Players */}
        <div className="w-48 md:w-64 lg:w-80 bg-black/10 backdrop-blur-sm border-r-4 border-yellow-400/50 p-2 md:p-4 overflow-y-auto">
          <h2 className="text-sm md:text-xl font-black text-white text-center mb-2 md:mb-4 bg-purple-600/50 rounded-full py-1 md:py-2">
            🤖 CPU PLAYERS
          </h2>
          {Object.values(G.players).filter(p => p.id !== parseInt(playerID)).map(player => (
            <div
              key={player.id}
              className={`mb-3 p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${ctx.currentPlayer == player.id
                ? 'bg-yellow-400/30 border-yellow-400 shadow-lg animate-pulse'
                : player.isEliminated
                  ? 'bg-red-900/30 border-red-500 opacity-60'
                  : 'bg-white/10 border-white/20'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold text-white text-lg">
                  {player.name}
                </div>
                <div className="text-xs bg-blue-500 px-2 py-1 rounded-full text-white font-bold">
                  🤖 CPU
                </div>
              </div>

              <div className="text-sm text-white/80 mb-2">
                💳 {player.hand?.length || 0} cards
              </div>

              <div className={`text-sm font-bold ${player.isEliminated ? 'text-red-400' : 'text-green-400'
                }`}>
                {player.isEliminated ? '💀 ELIMINATED' : '✅ ALIVE'}
              </div>

              {ctx.currentPlayer == player.id && !player.isEliminated && (
                <div className="text-sm text-yellow-300 animate-bounce mt-2 font-bold">
                  � THINKING...
                </div>
              )}

              {G.pendingExplodingKitten && G.pendingPlayer === player.id && (
                <div className="text-sm text-orange-300 animate-pulse mt-2 font-bold">
                  💥 PLACING KITTEN...
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center Game Area */}
        <div className="flex-1 flex flex-col">

          {/* Game Status Banner */}
          <div className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-sm text-white p-3 lg:p-4 border-b-2 border-yellow-400/50 status-banner">

            {G.pendingExplodingKitten && G.pendingPlayer === playerID && (
              <div className="bg-orange-500 rounded-lg p-2 lg:p-3 mb-2 lg:mb-3 text-center animate-bounce">
                <div className="font-black text-base lg:text-lg">🛡️ DEFUSE SUCCESSFUL!</div>
                <div className="text-xs lg:text-sm mobile-compact-text">Choose where to place the exploding kitten back in the deck!</div>
              </div>
            )}

            {G.pendingExplodingKitten && G.pendingPlayer !== playerID && (
              <div className="bg-orange-500/70 rounded-lg p-2 lg:p-3 mb-2 lg:mb-3 text-center">
                <div className="font-black text-base lg:text-lg">🛡️ {G.players[G.pendingPlayer]?.name} DEFUSED!</div>
                <div className="text-xs lg:text-sm mobile-compact-text">They're placing the exploding kitten back in the deck...</div>
              </div>
            )}

            {G.pendingFavor && G.favorTarget === playerID && (
              <div className="bg-purple-500 rounded-lg p-2 lg:p-3 mb-2 lg:mb-3 text-center animate-pulse">
                <div className="font-black text-base lg:text-lg">🤝 FAVOR REQUEST!</div>
                <div className="text-xs lg:text-sm mobile-compact-text">{G.players[G.pendingFavor]?.name} wants a card from you! Choose one from your hand below.</div>
              </div>
            )}

            {G.pendingFavor && G.favorTarget !== playerID && (
              <div className="bg-purple-500/70 rounded-lg p-2 lg:p-3 mb-2 lg:mb-3 text-center">
                <div className="font-black text-base lg:text-lg">🤝 FAVOR IN PROGRESS</div>
                <div className="text-xs lg:text-sm mobile-compact-text">{G.players[G.pendingFavor]?.name} is waiting for {G.players[G.favorTarget]?.name} to give them a card...</div>
              </div>
            )}

            {humanPlayer.isEliminated && (
              <div className="bg-red-600 rounded-lg p-2 lg:p-3 mb-2 lg:mb-3 text-center">
                <div className="font-black text-base lg:text-lg">💀 YOU'RE OUT!</div>
                <div className="text-xs lg:text-sm mobile-compact-text">You drew an exploding kitten without a defuse card! Watch the chaos unfold...</div>
              </div>
            )}

            {/* Current Turn Status */}
            <div className="text-center">
              <div className="text-sm lg:text-lg font-bold">
                {currentPlayer.isCPU && ctx.currentPlayer !== playerID && (
                  <span className="animate-pulse">🤖 {currentPlayer.name} is thinking...</span>
                )}
                {!currentPlayer.isCPU && ctx.currentPlayer === playerID && (
                  <span className="text-green-300 animate-bounce">✨ YOUR TURN! Play cards or draw!</span>
                )}
                {ctx.currentPlayer !== playerID && !currentPlayer.isCPU && (
                  <span>🎮 {currentPlayer.name}'s turn</span>
                )}
              </div>
            </div>
          </div>

          {/* Main Deck Area */}
          <div className="flex-1 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="flex items-center gap-4 md:gap-8 lg:gap-16 center-game-cards">

              {/* Draw Pile */}
              <div className="text-center group">
                <div className="bg-white rounded-2xl p-3 md:p-4 lg:p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-300 border-4 border-blue-400 center-game-card">
                  <div className="text-2xl md:text-4xl lg:text-6xl mb-1 md:mb-2 lg:mb-4">🎴</div>
                  <div className="text-gray-800 font-black text-sm md:text-base lg:text-xl">DRAW PILE</div>
                  <div className="text-blue-600 font-bold text-xs md:text-sm lg:text-lg">{G.deck?.length || 0} CARDS</div>
                </div>
              </div>

              {/* VS Divider */}
              <div className="text-center vs-divider">
                <div className="text-2xl md:text-4xl lg:text-6xl text-white/50 font-black transform rotate-12 animate-spin-slow">
                  ⚡
                </div>
              </div>

              {/* Discard Pile */}
              <div className="text-center group">
                <div className="bg-white rounded-2xl p-3 md:p-4 lg:p-8 shadow-2xl transform group-hover:scale-105 transition-all duration-300 border-4 border-orange-400 center-game-card">
                  <div className="text-2xl md:text-4xl lg:text-6xl mb-1 md:mb-2 lg:mb-4">
                    {G.discardPile?.length > 0 && G.discardPile[G.discardPile.length - 1]?.emoji ?
                      G.discardPile[G.discardPile.length - 1].emoji : '🗂️'}
                  </div>
                  <div className="text-gray-800 font-black text-sm md:text-base lg:text-xl">DISCARD</div>
                  <div className="text-orange-600 font-bold text-xs md:text-sm lg:text-lg">{G.discardPile?.length || 0} CARDS</div>
                  {G.discardPile?.length > 0 && (
                    <div className="text-gray-600 text-xs lg:text-sm mt-1 font-bold mobile-compact-text">
                      {G.discardPile[G.discardPile.length - 1]?.name}
                    </div>
                  )}
                </div>
              </div>            </div>
          </div>

          {/* Exploding Kitten Placement (if needed) */}
          {G.pendingExplodingKitten && G.pendingPlayer === playerID && (
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 border-t-4 border-yellow-400">
              <h3 className="text-xl font-black text-center text-white mb-3">💥 PLACE THE EXPLODING KITTEN 💥</h3>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => moves.placeExplodingKitten(0)}
                  className="bg-white text-red-600 font-bold py-3 px-6 rounded-full hover:bg-yellow-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  🔥 TOP (EVIL!)
                </button>
                <button
                  onClick={() => moves.placeExplodingKitten(Math.floor(G.deck.length / 2))}
                  className="bg-white text-red-600 font-bold py-3 px-6 rounded-full hover:bg-yellow-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  🎯 MIDDLE
                </button>
                <button
                  onClick={() => moves.placeExplodingKitten(G.deck.length)}
                  className="bg-white text-red-600 font-bold py-3 px-6 rounded-full hover:bg-yellow-100 transition-all transform hover:scale-105 shadow-lg"
                >
                  🛡️ BOTTOM (SAFE)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Player Hand */}
        <div className="w-48 md:w-64 lg:w-96 sidebar-right bg-black/10 backdrop-blur-sm border-l-4 border-yellow-400/50 flex flex-col">
          <PlayerHand
            player={humanPlayer}
            isActive={isActive}
            isCurrentPlayer={ctx.currentPlayer === playerID}
            canPlayCards={!ctx.gameover}
            canDrawCard={!ctx.gameover}
            moves={moves}
            deckCount={G.deck?.length || 0}
            hasPendingExplodingKitten={G.pendingExplodingKitten && G.pendingPlayer === playerID}
            players={G.players}
            gameState={G}
            onGiveFavorCard={handleGiveFavorCard}
          />
        </div>

      </div>

      {/* Debug Panel (Hidden by default, accessible via dev tools) */}
      <div className="fixed bottom-4 right-4 z-50">
        <details className="bg-black/80 backdrop-blur-sm rounded-lg text-white text-xs">
          <summary className="cursor-pointer p-2 text-yellow-300 font-bold hover:bg-white/10">
            🛠️ Debug
          </summary>
          <div className="p-4 max-w-md max-h-64 overflow-auto">
            <div className="space-y-2">
              <div><strong>Turn:</strong> {ctx.turn} | <strong>Player:</strong> {ctx.currentPlayer} | <strong>Active:</strong> {isActive ? 'Y' : 'N'}</div>
              <div><strong>Deck:</strong> {G.deck?.length} | <strong>Discard:</strong> {G.discardPile?.length}</div>
              <div><strong>Moves:</strong> {Object.keys(moves || {}).join(', ')}</div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default GameBoard;
