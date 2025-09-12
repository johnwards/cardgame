import { Client } from 'boardgame.io/react';
import ExplodingKittensGame from './game';
import { Local } from 'boardgame.io/multiplayer';
import { RandomBot, MCTSBot } from 'boardgame.io/ai';
import { ThinkingBot, FastThinkingBot, SlowThinkingBot } from './ai/ThinkingBot';
import GameBoard from './components/GameBoard';
import './index.css';

const ExplodingKittensClient = Client({
  game: ExplodingKittensGame,
  board: GameBoard,
  numPlayers: 4,
  debug: true,
  multiplayer: Local({
    bots: {
      '1': ThinkingBot,
      '2': FastThinkingBot,
      '3': SlowThinkingBot
    }
  }),
});

function App() {
  return (
    <div className="App">
      <ExplodingKittensClient playerID="0" />
    </div>
  );
}

export default App;
