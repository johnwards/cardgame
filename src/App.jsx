import { Client } from 'boardgame.io/react';
import ExplodingKittensGame from './game';
import { Local } from 'boardgame.io/multiplayer';
import { RandomBot, MCTSBot } from 'boardgame.io/ai';
import { ThinkingBot, FastThinkingBot, SlowThinkingBot } from './ai/ThinkingBot';
import GameBoard from './components/GameBoard';
import './index.css';

// Phase C.2: Client configuration - AI with thinking time for more natural gameplay
const ExplodingKittensClient = Client({
  game: ExplodingKittensGame,
  board: GameBoard,
  numPlayers: 4, // Phase A: Force 4 players
  debug: true,
  multiplayer: Local({
    bots: {
      '1': ThinkingBot,         // Bot for player 1 - normal thinking speed
      '2': FastThinkingBot,     // Bot for player 2 - faster decisions
      '3': SlowThinkingBot      // Bot for player 3 - more deliberate
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
