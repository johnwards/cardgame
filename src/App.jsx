import { Client } from 'boardgame.io/react';
import ExplodingKittensGame from './game';
import { Local } from 'boardgame.io/multiplayer';
import { RandomBot, MCTSBot } from 'boardgame.io/ai';
import GameBoard from './components/GameBoard';
import './index.css';

// Phase C.2: Client configuration - simple setup for AI testing
const ExplodingKittensClient = Client({
  game: ExplodingKittensGame,
  board: GameBoard,
  numPlayers: 4, // Phase A: Force 4 players
  debug: true,
  multiplayer: Local({
    bots: {
      '1': MCTSBot,  // Bot for player 1
      '2': MCTSBot,    // Bot for player 2  
      '3': MCTSBot   // Bot for player 3
    }
  }),
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
