# Copilot Instructions - Card Game Project

## Project Overview
This is a web-based card game clone of Exploding Kittens mechanics, built as a 4-player game (1 human player vs 3 CPU players). This is a **hobby/toy project** focused on **quick development and working code** rather than production polish. The game is client-side only and uses React with standard JavaScript (no TypeScript).

## Technology Stack
- **Frontend Framework**: React (latest stable version)
- **Game Engine**: boardgame.io
- **Language**: JavaScript (ES6+, NO TypeScript)
- **Styling**: CSS3 (consider CSS modules or styled-components)
- **Build Tool**: Vite
- **State Management**: boardgame.io handles game state, React state for UI
- **AI Players**: Simple AI logic for CPU opponents, look at what boardgame provides

## Game Mechanics (Based on Exploding Kittens)
### Core Rules
- Deck contains various action cards and exploding cards
- Players draw cards on their turn
- If you draw an exploding card without a defuse card, you're eliminated
- Last player standing wins
- Players can play action cards to affect gameplay

### Card Types to Implement
1. **Exploding Cards** - Eliminate players (unless they have defuse)
2. **Defuse Cards** - Neutralize exploding cards
3. **Skip Cards** - End turn without drawing
4. **Attack Cards** - Force next player to take 2 turns
5. **Shuffle Cards** - Shuffle the deck
6. **See the Future Cards** - View top 3 cards
7. **Favor Cards** - Force another player to give you a card
8. **Nope Cards** - Cancel another player's action
9. **Cat Cards** - Various types that can be collected and played in pairs/sets

### Game Flow
1. Deal initial hands (defuse + random cards)
2. Place remaining defuse cards in deck
3. Add exploding cards (1 less than player count)
4. Shuffle deck
5. Players take turns drawing and playing cards
6. Game ends when only 1 player remains

## Project Structure Guidelines
```
src/
├── components/           # React components
│   ├── Game/            # Main game container
│   ├── Board/           # Game board display
│   ├── Hand/            # Player hand component
│   ├── Card/            # Individual card component
│   ├── PlayerArea/      # Player info and status
│   └── UI/              # General UI components
├── game/                # boardgame.io game logic
│   ├── moves/           # Game moves/actions
│   ├── phases/          # Game phases
│   ├── cards/           # Card definitions and logic
│   └── ai/              # CPU player logic
├── utils/               # Utility functions
├── constants/           # Game constants
├── styles/              # CSS files
└── assets/              # Images and other assets
```

## Development Guidelines

### Focus: Quick Development & Working Code
- **Priority**: Get working boardgame.io integration quickly over perfect architecture
- **Use framework patterns**: Leverage boardgame.io's built-in features rather than custom solutions
- **No production concerns**: Skip optimization, security hardening, and scalability
- **Prototype mindset**: Favor boardgame.io's established patterns over custom implementations
- **Rapid iteration**: Build features incrementally using framework capabilities

### boardgame.io Best Practices
- Use `G` mutation directly - framework handles immutability automatically
- Return `INVALID_MOVE` for move validation rather than throwing errors
- Leverage `ctx` for all turn/phase/player management instead of custom state
- Use `random` object for all randomness to maintain deterministic replay
- Implement `playerView` for secret state rather than client-side hiding
- Use `events` system for turn/phase transitions rather than manual state changes
- Let `ai.enumerate` define valid moves and framework handle strategy

### Code Style
- Use functional components with hooks (no class components)
- Use arrow functions for component definitions
- Keep code simple and readable
- Don't worry about perfect organization - focus on functionality
- Use meaningful variable and function names when convenient

### boardgame.io Integration
**Core Architecture:**
- Use boardgame.io's two-object state pattern: `G` (your game state) and `ctx` (framework metadata)
- Define game logic in separate files from React components
- Leverage boardgame.io's immutability system - you can mutate `G` directly, framework handles immutability
- Use `INVALID_MOVE` return value for move validation

**Game Definition Structure:**
- Use `setup` function for initial game state with `ctx` parameter for player count, etc.
- Implement `moves` as pure functions that modify `G`
- Use `endIf` for win conditions (return object available in `ctx.gameover`)
- Implement `turn` configuration for turn management
- Use `phases` for different game states (setup, playing, cleanup)
- Add `ai.enumerate` function for bot move generation

**State Management:**
- Game state in `G` must be JSON-serializable (no functions/classes)
- Use `ctx.currentPlayer`, `ctx.turn`, `ctx.numPlayers` for game metadata
- Leverage `playerView` for secret information (hands, deck order)
- Use `random` object for deterministic randomness (Shuffle, Die, etc.)

**Turn and Phase Management:**
- Use `turn.order` for custom turn orders (TurnOrder.DEFAULT, ONCE, CUSTOM, etc.)
- Implement `turn.onBegin`, `turn.onEnd`, `turn.onMove` hooks
- Use `turn.minMoves`/`turn.maxMoves` for automatic turn ending
- Implement `phases` for game flow (draw phase -> play phase)
- Use `events.endTurn()`, `events.endPhase()`, `events.setPhase()` for transitions

**Events System:**
- Call events from moves: `events.endTurn()`, `events.endPhase()`, `events.endGame()`
- Use `setActivePlayers` for simultaneous player actions
- Implement `stages` within turns for complex player interactions

**AI Implementation:**
- Define `ai.enumerate` to return array of possible moves: `[{move: 'moveName', args: [...]}]`
- Framework provides MCTS bot automatically
- Use simple move enumeration, let framework handle strategy

### State Management
- Game state managed by boardgame.io
- UI state (animations, modals, etc.) managed by React
- Use context or props for sharing UI state
- Keep boardgame.io state immutable

### AI Implementation
- Use boardgame.io's built-in MCTS (Monte Carlo Tree Search) bot
- Implement `ai.enumerate` to return array of possible moves: `[{move: 'moveName', args: [...]}]`
- Framework automatically handles AI strategy and move selection
- AI strength controlled by iteration count (default 1000)
- Only enumerate moves for CPU players (check `player.isCPU`)
- Let framework handle timing, decision-making, and execution

### Card System
- Each card type should have:
  - Unique identifier
  - Display name and description
  - Play conditions (when it can be played)
  - Effect function (what happens when played)
  - Target requirements (if any)
- Use factory pattern for card creation
- Implement card validation before playing

### UI/UX Considerations
- **Placeholder Graphics**: Use simple colored rectangles or basic shapes for cards initially
- **Card Layout**: Cards should be clearly readable with name, type, and description
- **Hand Management**: Fan out cards in hand, highlight playable cards
- **Turn Indicators**: Clear indication of whose turn it is
- **Action Feedback**: Show what actions are happening (animations/messages)
- **Game Log**: Display recent actions for all players
- **Responsive Design**: Should work on desktop and tablet



## Testing & Feedback
- **No formal testing required** - testing is done by playing the game
- End user (developer) will test by playing and provide feedback to AI
- Focus on getting features working, bugs can be fixed iteratively

## Future Considerations
- **Custom Card Art**: Design will be replaced with custom artwork later
- **Animations**: Plan for card movement and effect animations
- **Sound Effects**: Audio feedback for actions
- **Multiple Game Modes**: Different rule variants
- **Online Multiplayer**: Potential future enhancement
- **Mobile App**: React Native version possibility

## Development Priorities
1. **Phase 1**: Get a basic playable game working
2. **Phase 2**: Add all card types and basic mechanics
3. **Phase 3**: Simple AI that makes random valid moves
4. **Phase 4**: Basic UI that's functional (doesn't need to be pretty)
5. **Phase 5**: Improve AI to make smarter decisions
6. **Phase 6**: Polish only if requested

## Common Patterns to Use

### Component Structure
```javascript
const ComponentName = ({ prop1, prop2 }) => {
  const [localState, setLocalState] = useState(initialValue);
  
  const handleAction = useCallback(() => {
    // Action logic
  }, [dependencies]);
  
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};
```

### boardgame.io Game Structure
```javascript
import { INVALID_MOVE, TurnOrder, PlayerView } from 'boardgame.io/core';

const ExplodingKittensGame = {
  name: 'exploding-kittens',
  
  setup: ({ ctx, random }) => {
    // Use ctx.numPlayers, random.Shuffle(), etc.
    const deck = createAndShuffleDeck(random);
    return {
      deck,
      players: createPlayers(ctx.numPlayers),
      discardPile: [],
      // secret state for deck order
      secret: { deckOrder: deck.map(c => c.id) }
    };
  },
  
  moves: {
    playCard: ({ G, ctx, playerID, events, random }, cardIndex) => {
      // Validate move
      if (!canPlayCard(G, playerID, cardIndex)) {
        return INVALID_MOVE;
      }
      
      // Mutate G directly - framework handles immutability
      const card = G.players[playerID].hand.splice(cardIndex, 1)[0];
      G.discardPile.push(card);
      
      // Auto-end turn for simple cards
      if (card.type === 'simple') {
        events.endTurn();
      }
    },
    
    drawCard: ({ G, ctx, playerID, events, random }) => {
      if (G.deck.length === 0) return INVALID_MOVE;
      
      const card = G.deck.pop();
      G.players[playerID].hand.push(card);
      
      if (card.type === 'exploding') {
        // Handle exploding kitten logic
        handleExplodingKitten(G, playerID, events);
      } else {
        events.endTurn();
      }
    }
  },
  
  turn: {
    order: TurnOrder.DEFAULT,
    minMoves: 1,
    maxMoves: 1,
    onBegin: ({ G, ctx, events }) => {
      // Turn start logic
    }
  },
  
  phases: {
    setup: {
      start: true,
      next: 'playing',
      moves: { /* setup-only moves */ },
      endIf: ({ G }) => G.setupComplete
    },
    playing: {
      moves: { playCard, drawCard },
      endIf: ({ G }) => getAlivePlayers(G).length <= 1
    }
  },
  
  endIf: ({ G, ctx }) => {
    const alivePlayers = getAlivePlayers(G);
    if (alivePlayers.length === 1) {
      return { winner: alivePlayers[0].id };
    }
  },
  
  ai: {
    enumerate: ({ G, ctx }) => {
      const moves = [];
      const player = G.players[ctx.currentPlayer];
      
      // Add playCard moves for each card
      player.hand.forEach((card, index) => {
        if (canPlayCard(G, ctx.currentPlayer, index)) {
          moves.push({ move: 'playCard', args: [index] });
        }
      });
      
      // Add drawCard move if valid
      if (canDrawCard(G, ctx.currentPlayer)) {
        moves.push({ move: 'drawCard', args: [] });
      }
      
      return moves;
    }
  },
  
  // Hide other players' hands and deck order
  playerView: PlayerView.STRIP_SECRETS,
  
  // Use deterministic randomness
  seed: 'development-seed'
};
```

### Card Definition Pattern
```javascript
const cardType = {
  id: 'unique-id',
  name: 'Card Name',
  description: 'What this card does',
  type: 'action', // or 'exploding', 'defuse', etc.
  canPlay: (G, ctx, playerId) => boolean,
  play: (G, ctx, playerId, ...args) => newGameState,
  target: 'none' | 'player' | 'self' // targeting requirements
};
```

### boardgame.io Client Usage
```javascript
// React Client
import { Client } from 'boardgame.io/react';

const App = Client({
  game: ExplodingKittensGame,
  board: GameBoard,
  numPlayers: 4,
  debug: true // Shows debug panel in development
});

// In React components - props automatically provided
function GameBoard({ G, ctx, moves, events, playerID, isActive }) {
  const handleCardPlay = (cardIndex) => {
    if (isActive) {
      moves.playCard(cardIndex);
    }
  };
  
  const handleDrawCard = () => {
    if (isActive) {
      moves.drawCard();
    }
  };
  
  // Use ctx.currentPlayer, ctx.turn, ctx.gameover
  const isMyTurn = ctx.currentPlayer === playerID;
  const gameOver = ctx.gameover;
  
  return (
    <div>
      {/* Render game state using G, ctx */}
      <PlayerHand 
        cards={G.players[playerID]?.hand || []} 
        onCardPlay={handleCardPlay}
        disabled={!isMyTurn || !isActive}
      />
      <button onClick={handleDrawCard} disabled={!isMyTurn || !isActive}>
        Draw Card
      </button>
      {gameOver && <div>Winner: {gameOver.winner}</div>}
    </div>
  );
}
```

### Secret State & Randomness
```javascript
// Use boardgame.io's secret state pattern
const setup = ({ ctx, random }) => {
  const deck = createDeck();
  random.Shuffle(deck); // Deterministic shuffling
  
  return {
    deck,
    players: createPlayers(ctx.numPlayers),
    // Secret information hidden from clients
    secret: {
      deckOrder: deck.map(c => c.id),
      futureCards: deck.slice(0, 5)
    }
  };
};

// Use PlayerView.STRIP_SECRETS to automatically hide 'secret' key
const game = {
  setup,
  playerView: PlayerView.STRIP_SECRETS,
  // Always use random from moves for deterministic play
  moves: {
    shuffleDeck: ({ G, random }) => {
      G.deck = random.Shuffle(G.deck);
    }
  }
};
```

## Notes for AI Assistant
- **Hobby project mentality**: Focus on getting boardgame.io integration working quickly
- **Use framework capabilities**: Always prefer boardgame.io's built-in features over custom solutions
- Always use JavaScript, never TypeScript
- Import key boardgame.io utilities: `import { INVALID_MOVE, TurnOrder, PlayerView } from 'boardgame.io/core';`
- Use React Client: `import { Client } from 'boardgame.io/react';`
- Build incrementally - get basic boardgame.io game working ASAP
- Use placeholder content for graphics initially
- **Testing approach**: User will test by playing the game and report issues
- Don't worry about edge cases unless they break core gameplay
- Prioritize proper boardgame.io patterns over visual polish
- When in doubt, check boardgame.io documentation patterns and choose the framework-recommended solution
