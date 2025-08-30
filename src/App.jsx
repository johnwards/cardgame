/**
 * App Component - Phase A Implementation
 * 
 * Phase A.1: Configured for exactly 4 players (1 human + 3 CPU)
 */

import { Client } from 'boardgame.io/react';
import ExplodingKittensGame from './game';
import GameBoard from './components/GameBoard';
import './index.css';

// Phase A client configuration - exactly 4 players
const ExplodingKittensClient = Client({
  game: ExplodingKittensGame,
  board: GameBoard,
  numPlayers: 4, // Phase A: Force 4 players
  debug: true
});

/**
 * Main App component - renders the game client
 */
function App() {
  return (
    <div className="App">
      <ExplodingKittensClient playerID="0" />
    </div>
  );
}

export default App;
