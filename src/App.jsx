/**
 * Main App Component - Integrates with boardgame.io Client
 * 
 * This component sets up the boardgame.io React Client with proper configuration
 * for CPU timing delays and AI integration as specified in Task 2.3.
 */

import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import ExplodingKittensGame from './game';
import GameBoard from './components/GameBoard';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

/**
 * Configure boardgame.io Client with AI support for CPU players
 * The AI system is configured in the game definition itself
 */
const ExplodingKittensClient = Client({
  game: ExplodingKittensGame,
  board: GameBoard,

  // Local multiplayer setup for single-device play
  multiplayer: Local(),

  // Number of players
  numPlayers: 4,

  // Debug mode for development
  debug: true // Enable debug mode to see more errors
});

/**
 * Main App component - renders the game client
 */
function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        {/* 
          Render the game for the human player (playerID: '0')
          The boardgame.io framework automatically handles:
          - CPU move enumeration through ai.enumerate
          - Move validation through INVALID_MOVE returns
          - Turn management through events.endTurn()
          - CPU timing delays are implemented in GameBoard component
          
          Players:
          - Player 0: Human player ("You")
          - Player 1: CPU player ("CPU 1") 
          - Player 2: CPU player ("CPU 2")
          - Player 3: CPU player ("CPU 3")
        */}
        <ExplodingKittensClient playerID="0" />
      </div>
    </ErrorBoundary>
  );
}

export default App;
