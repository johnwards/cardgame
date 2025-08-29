# Phase 1: Core Game Foundation Implementation Plan

## Instructions for Implementation

This implementation plan breaks down the Phase 1 Core Game Foundation feature into logical phases and specific tasks. Each task is designed to be completed by an AI agent within a single session while producing working, tested code.

**Prerequisites**: Review the requirements and design documents for this feature before beginning implementation.

**Project Context**: 
- **Technology Stack**: React 19, boardgame.io 0.50.2, Vite 7, Tailwind CSS 3.4, JavaScript (no TypeScript)
- **Architecture Patterns**: React functional components with hooks, boardgame.io for game state management, component-based UI architecture
- **Development Workflow**: Rapid prototyping focused on working code over perfect architecture
- **Quality Standards**: Hobby project mentality - prioritize functionality over production polish, user testing through gameplay

## Phase 1: Game Infrastructure Foundation

### 1.1 Boardgame.io Game Definition and Setup
- [ ] **Deliverable**: Complete boardgame.io game definition with setup function and basic state structure
- **Implementation Details**:
  - Create game definition file with setup function that initializes 4 players (1 human "You", 3 CPU players)
  - Generate deck with 3 Exploding Kittens, 6 Defuse cards, 47 regular cards (56 total)
  - Deal 1 Defuse + 7 regular cards to each player (8 cards per player)
  - Add remaining 2 Defuse + 3 Exploding Kittens to shuffled draw pile (24 cards)
  - Implement card object structure with id, type, name, emoji properties
  - Set random starting player and initialize turn order
- **Testing**: Manual verification through browser console that game state initializes correctly
- **Requirements**: Requirement 1 - Basic Game Setup and Initialization (all acceptance criteria)

### 1.2 Core Move Functions Implementation
- [ ] **Deliverable**: Implement playCard, drawCard, and placeExplodingKitten moves with validation
- **Implementation Details**:
  - Create playCard move that removes card from player hand to discard pile
  - Implement drawCard move that transfers top deck card to player hand and ends turn
  - Add placeExplodingKitten move for inserting defused exploding kittens back into deck
  - Include move validation to prevent invalid actions (empty deck, wrong turn, etc.)
  - Implement turn progression logic that advances to next non-eliminated player
  - Add basic error handling for edge cases
- **Testing**: Console testing of move functions with various game states
- **Requirements**: Requirement 2 - Core Turn-Based Gameplay Loop (criteria 1-6)

### 1.3 Exploding Kitten and Elimination Logic
- [ ] **Deliverable**: Complete exploding kitten detection, defuse mechanics, and player elimination system
- **Implementation Details**:
  - Add automatic detection when player draws exploding kitten card
  - Implement defuse card usage logic (automatic consumption when available)
  - Create player elimination system that removes players from turn order
  - Add exploding kitten placement interface for human players (simple position selection)
  - Implement win condition detection (last player standing or no exploding kittens remaining)
  - Handle game end state with winner declaration
- **Testing**: Test elimination scenarios and win conditions through gameplay simulation
- **Requirements**: Requirement 3 - Exploding Kitten and Defuse Mechanics (all acceptance criteria)

## Phase 2: React UI Implementation

### 2.1 Basic Game Board and Layout Components
- [ ] **Deliverable**: Main GameBoard component with basic layout and game state display
- **Implementation Details**:
  - Create GameBoard component that connects to boardgame.io client
  - Implement basic layout with areas for player hand, game info, and other players
  - Add deck display showing draw pile count and top discard card
  - Create turn indicator showing current player with simple highlight
  - Display player information (names, card counts, elimination status)
  - Use Tailwind CSS for basic styling with responsive layout
- **Testing**: Visual verification that all game state information displays correctly
- **Requirements**: Requirement 4 - Basic User Interface and Game State Display (criteria 1, 2, 3)

### 2.2 Player Hand and Card Interaction
- [ ] **Deliverable**: Interactive player hand component with card display and play functionality
- **Implementation Details**:
  - Create Card component with emoji display, name, and basic styling
  - Implement PlayerHand component showing human player's complete hand
  - Add click handlers for card selection and play actions
  - Create draw button for ending turn by drawing from deck
  - Implement card hover effects and selection states with Tailwind
  - Add simple validation feedback (disable invalid actions)
- **Testing**: Manual testing of card interactions and move execution
- **Requirements**: Requirement 4 - Basic User Interface and Game State Display (criteria 4, 5, 6)

### 2.3 Game Controls and State Feedback
- [ ] **Deliverable**: Complete user interface with action controls and game state feedback
- **Implementation Details**:
  - Add exploding kitten placement interface (simple dropdown or buttons for position)
  - Implement game end screen with winner display and new game option
  - Create simple notifications for game events (eliminations, card plays)
  - Add loading states and turn progression indicators
  - Implement basic game log showing recent actions
  - Style all components with Tailwind for consistent appearance
- **Testing**: Complete UI workflow testing through full game scenarios
- **Requirements**: Requirement 4 - Basic User Interface and Game State Display (all criteria), Requirement 3 (criteria 3, 6)

## Phase 3: CPU Player Integration

### 3.1 Basic CPU Decision Logic
- [ ] **Deliverable**: Simple CPU AI that makes random but valid moves with appropriate timing
- **Implementation Details**:
  - Implement CPU move selection logic (random choice between play card or draw)
  - Add 1-3 second delays for CPU actions to simulate thinking time
  - Create CPU card selection (random card from hand when playing)
  - Implement automatic defuse usage for CPU players when drawing exploding kittens
  - Add random position selection for CPU exploding kitten placement
  - Integrate CPU logic with boardgame.io's AI framework
- **Testing**: Play complete games against CPU opponents to verify behavior
- **Requirements**: Requirement 5 - Basic CPU Player Behavior (criteria 1, 2, 3)

### 3.2 CPU Integration and Game Flow Polish
- [ ] **Deliverable**: Complete 4-player game with smooth CPU integration and proper game flow
- **Implementation Details**:
  - Add CPU elimination notifications and visual feedback
  - Implement proper game flow with CPU turn progression
  - Create visual indicators for CPU actions (card played, drew card, etc.)
  - Add CPU player status display (thinking, playing, eliminated)
  - Ensure smooth transition between human and CPU turns
  - Handle edge cases like all CPU elimination or CPU wins
- **Testing**: Full gameplay testing with various scenarios and game outcomes
- **Requirements**: Requirement 5 - Basic CPU Player Behavior (criteria 4, 5, 6)

### 3.3 Final Integration and Polish
- [ ] **Deliverable**: Complete, playable Phase 1 game with all requirements met
- **Implementation Details**:
  - Final integration testing of all components and systems
  - Add basic error boundaries to prevent crashes
  - Implement simple restart functionality for new games
  - Polish UI feedback and transitions with Tailwind animations
  - Add basic accessibility features (keyboard navigation, screen reader support)
  - Final validation of all requirements and acceptance criteria
- **Testing**: Comprehensive gameplay testing covering all requirements and edge cases
- **Requirements**: All Phase 1 requirements validation and final acceptance criteria verification

## Implementation Notes

### Development Workflow
1. **Setup**: Start development server using `npm run dev`
2. **Foundation**: Implement boardgame.io game logic first as it drives all other components
3. **Dependencies First**: Build game engine before UI components that depend on it
4. **Integration**: Connect React components to boardgame.io incrementally
5. **Testing**: Play the game manually after each major component to verify functionality
6. **Verification**: Complete full game scenarios to ensure all requirements are met

### Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build project for production
npm install          # Install dependencies
npm run preview      # Preview production build
```

### Quality Checklist

Before marking any task complete, ensure:
- [ ] Code runs without errors in the browser
- [ ] All implemented features work through manual gameplay testing
- [ ] Code follows project conventions (functional components, simple patterns)
- [ ] No placeholder code or TODO comments remain
- [ ] Changes integrate smoothly with existing codebase
- [ ] Basic error handling prevents crashes during normal gameplay
- [ ] UI is functional and provides clear feedback to the user
- [ ] Game logic correctly implements the specified rules
- [ ] CPU opponents make reasonable decisions and don't break game flow
- [ ] All requirement acceptance criteria are demonstrably met through gameplay

## Success Criteria

### Phase Completion Requirements
- [ ] Game initializes with proper 4-player setup and deck composition
- [ ] Complete turn cycle works for human player input and CPU automation
- [ ] Exploding kitten and defuse mechanics function correctly with eliminations
- [ ] UI clearly displays all game state and allows human player interaction
- [ ] CPU opponents play reasonable games with appropriate timing
- [ ] Game ends properly with winner declaration and restart option
- [ ] All 5 requirements from the requirements document are fully implemented
- [ ] Game is playable end-to-end without crashes or major bugs

### Quality Standards Met
- [ ] Hobby project standards: working code prioritized over perfect architecture
- [ ] Simple, functional UI that gets the job done without polish requirements
- [ ] CPU opponents that provide engaging gameplay without sophisticated AI
- [ ] Code that can be easily extended for future phases
- [ ] Manual testing demonstrates all game mechanics work as intended