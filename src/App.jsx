/**
 * Main App Component - Integrates with boardgame.io Client
 * 
 * This component sets up the boardgame.io React Client with proper configuration
 * for CPU timing delays and AI integration as specified in Task 2.3.
 */

import { Client } from 'boardgame.io/react';
import ExplodingKittensGame from './game';
import GameBoard from './components/GameBoard';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

/**
 * Configure boardgame.io Client for single-player vs AI game
 * Based on official documentation for single-player with built-in AI
 */
const ExplodingKittensClient = Client({
  game: ExplodingKittensGame,
  board: GameBoard,

  // Specify 4 players for single-player vs AI mode
  // boardgame.io defaults to 2 players in single-player mode
  numPlayers: 4,

  // Single-player setup - no multiplayer configuration needed
  // The game's ai.enumerate function handles CPU players automatically
  // boardgame.io will call the AI during CPU turns (players 1, 2, 3)

  // Debug mode for development
  debug: true
});

/**
 * Main App component - renders the game client
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        {/* 
          Render the game in single-player mode with explicit playerID
          The boardgame.io framework automatically handles:
          - Human player as player 0 ("You") 
          - CPU players as players 1, 2, 3 through ai.enumerate
          - Turn management and AI move execution
          - Proper game state synchronization
          
          playerID "0" explicitly assigns human to player 0
          AI turns are executed automatically when it's a CPU player's turn
        */}
        <ExplodingKittensClient playerID="0" />
      </div>
    </ErrorBoundary>
  );
}

export default App;
