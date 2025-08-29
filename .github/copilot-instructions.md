# Copilot Instructions - Card Game Project

## Project Overview
This is a web-based card game clone of Exploding Kittens mechanics, built as a 4-player game (1 human player vs 3 CPU players). The game is client-side only and uses React with standard JavaScript (no TypeScript).

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

### Code Style
- Use functional components with hooks (no class components)
- Use arrow functions for component definitions
- Use destructuring for props and state
- Keep components small and focused
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### boardgame.io Integration
- Define game logic in separate files from React components
- Use boardgame.io's `moves` for player actions
- Implement `setup` function for initial game state
- Use `ctx` (context) for turn management and player info
- Implement `endIf` for win conditions
- Use `events` for phase transitions

### State Management
- Game state managed by boardgame.io
- UI state (animations, modals, etc.) managed by React
- Use context or props for sharing UI state
- Keep boardgame.io state immutable

### AI Implementation
- Start with simple random AI
- Gradually add strategic decision making
- AI should make decisions based on:
  - Current hand composition
  - Known information about other players
  - Deck state and probabilities
  - Game phase and turn order

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

## Performance Guidelines
- Lazy load components where possible
- Optimize re-renders with React.memo where needed
- Use keys properly in lists
- Avoid creating objects/functions in render methods
- Consider virtualization for large card lists

## Testing Strategy
- Unit tests for game logic (moves, card effects)
- Integration tests for boardgame.io game flow
- Component tests for React components
- AI behavior tests
- Game rule validation tests

## Security Considerations
- Client-side only means no server validation
- Prevent cheating through UI manipulation
- Validate all moves in game logic
- Don't expose sensitive game state to players

## Deployment
- Static site deployment (Netlify, Vercel, or GitHub Pages)
- Build optimization for production
- Asset optimization for faster loading

## Future Considerations
- **Custom Card Art**: Design will be replaced with custom artwork later
- **Animations**: Plan for card movement and effect animations
- **Sound Effects**: Audio feedback for actions
- **Multiple Game Modes**: Different rule variants
- **Online Multiplayer**: Potential future enhancement
- **Mobile App**: React Native version possibility

## Development Priorities
1. **Phase 1**: Basic game engine with boardgame.io
2. **Phase 2**: Core card mechanics and rules
3. **Phase 3**: Simple AI opponents
4. **Phase 4**: UI polish and user experience
5. **Phase 5**: Advanced AI and game balance
6. **Phase 6**: Custom graphics and animations

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

### boardgame.io Move Structure
```javascript
const moveName = (G, ctx, ...args) => {
  // Validate move
  if (!isValidMove(G, ctx, ...args)) {
    return INVALID_MOVE;
  }
  
  // Apply move effects
  // Always return new state, don't mutate G
  return {
    ...G,
    // updated properties
  };
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

## Notes for AI Assistant
- Always use JavaScript, never TypeScript
- Prefer functional programming patterns
- Keep boardgame.io game logic separate from React components
- Focus on getting basic functionality working before adding complexity
- Use placeholder content for graphics and styling initially
- Prioritize game mechanics over visual polish in early phases
- Consider the iterative development approach - build incrementally
