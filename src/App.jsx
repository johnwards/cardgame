/**
 * MINIMAL App Component - Following tutorial pattern exactly
 */

import { Client } from 'boardgame.io/react';
import ExplodingKittensGame from './game';
import GameBoard from './components/GameBoard';
import './index.css';

// Ultra-simple client configuration following tutorial pattern
const ExplodingKittensClient = Client({
  game: ExplodingKittensGame,
  board: GameBoard,
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
