# Phase 1: Core Game Foundation Implementation Plan

## Instructions for Implementation

This implementation plan breaks down the Exploding Kittens Phase 1 feature into logical phases and specific tasks. Each task is designed to be completed by an AI agent within a single session while producing working, tested code.

**Prerequisites**: Review the requirements and design documents for this feature before beginning implementation.

**Project Context**: 
- **Technology Stack**: React 19, boardgame.io 0.50.2, Vite 7, Tailwind CSS 3.4
- **Architecture Patterns**: boardgame.io React Client integration with centralized state management
- **Development Workflow**: Vite development server with hot reload for rapid prototyping
- **Quality Standards**: Component-based React architecture with proper state management through boardgame.io

## Phase 1: Core Game Infrastructure

### 1.1 Card System and Data Models Implementation
- [x] **Deliverable**: Complete card system with proper data structures and helper functions
- **Implementation Details**:
  - Create `src/constants/cards.js` with card type definitions, creation helpers, and deck generation functions
  - Implement card objects with `{id, type, name, emoji, description}` structure
  - Add helper functions for deck creation, shuffling, and card type validation
  - Include proper card counts: 3 Exploding Kittens, 6 Defuse cards, 47 regular cards
- **Requirements**: Requirement 1 (Acceptance Criteria 2, 3, 4)

### 1.2 boardgame.io Game Definition Setup
- [x] **Deliverable**: Core game definition with setup function and initial state management
- **Implementation Details**:
  - Create `src/game/index.js` with boardgame.io game definition structure
  - Implement `setup()` function creating 4 players with proper initialization
  - Configure game state `G` with deck, players, discardPile, and secret state
  - Add proper player data structure with `{id, name, hand, isEliminated, isCPU}` fields
  - Use `random.Shuffle()` for deterministic deck shuffling and initial dealing
- **Requirements**: Requirement 1 (Acceptance Criteria 1, 3, 5, 6)

### 1.3 Turn Management and Game Flow Configuration
- [ ] **Deliverable**: Complete turn system with proper boardgame.io integration
- **Implementation Details**:
  - Configure `turn` object with `TurnOrder.DEFAULT`, proper move limits
  - Implement `onBegin` turn handler to skip eliminated players
  - Add game phases for setup and playing with proper transitions
  - Configure `endIf` conditions for game completion (single winner or draw)
  - Use `PlayerView.STRIP_SECRETS` for proper information hiding
- **Requirements**: Requirement 2 (Acceptance Criteria 1, 4), Requirement 3 (Acceptance Criteria 4)

## Phase 2: Core Gameplay Moves and Logic

### 2.1 Basic Card Play and Draw Moves
- [ ] **Deliverable**: Core move functions with proper validation and state management
- **Implementation Details**:
  - Implement `playCard` move with card validation and discard pile management
  - Implement `drawCard` move with deck management and turn ending
  - Add proper `INVALID_MOVE` validation for all edge cases
  - Use `events.endTurn()` for automatic turn progression
  - Handle empty deck scenarios with proper game state updates
- **Requirements**: Requirement 2 (Acceptance Criteria 2, 3, 5, 6)

### 2.2 Exploding Kitten and Defuse Mechanics
- [ ] **Deliverable**: Complete Exploding Kitten detection and defuse system
- **Implementation Details**:
  - Add Exploding Kitten detection logic in `drawCard` move
  - Implement automatic defuse card checking and consumption
  - Create `placeExplodingKitten` move for deck insertion with position selection
  - Add player elimination logic when no defuse cards available
  - Handle game state updates for eliminated players and remaining deck
- **Requirements**: Requirement 3 (Acceptance Criteria 1, 2, 3, 5, 6)

### 2.3 CPU Player AI Integration
- [ ] **Deliverable**: Complete AI system using boardgame.io's built-in MCTS bot
- **Implementation Details**:
  - Implement `ai.enumerate` function returning valid move arrays for CPU players
  - Add CPU decision logic for card playing vs drawing with random selection
  - Configure automatic defuse usage and random Exploding Kitten placement for CPU
  - Use `player.isCPU` flags for proper AI move enumeration
  - Add timing delays (1-3 seconds) for CPU moves to maintain game flow
- **Requirements**: Requirement 5 (Acceptance Criteria 1, 2, 3, 4, 5, 6)

## Phase 3: User Interface Implementation

### 3.1 Main GameBoard Component with boardgame.io Integration
- [ ] **Deliverable**: Core React component integrated with boardgame.io Client
- **Implementation Details**:
  - Create `src/components/GameBoard.jsx` receiving `{G, ctx, moves, events, playerID, isActive}` props
  - Implement game state display using `G.players`, `G.deck.length`, `G.discardPile`
  - Add turn indicator using `ctx.currentPlayer` and `isActive` prop
  - Handle game over display with `ctx.gameover.winner` information
  - Use proper Tailwind CSS classes for responsive layout and styling
- **Requirements**: Requirement 4 (Acceptance Criteria 3, 4, 6)

### 3.2 Player Hand and Card Interaction Components
- [ ] **Deliverable**: Interactive player hand with card play functionality
- **Implementation Details**:
  - Create player hand display showing human player's complete hand with card details
  - Implement card click handlers calling `moves.playCard(cardIndex)` through props
  - Add draw button calling `moves.drawCard()` with proper enabling/disabling
  - Display other players' card counts and elimination status without revealing cards
  - Use Tailwind CSS for card styling, hover effects, and responsive design
- **Requirements**: Requirement 4 (Acceptance Criteria 1, 2), Requirement 2 (Acceptance Criteria 2, 3)

### 3.3 Game Area and Status Display Components
- [ ] **Deliverable**: Complete game area with deck, discard pile, and status information
- **Implementation Details**:
  - Create game area showing draw pile count, discard pile with top card visible
  - Add current player indicator with clear visual highlighting
  - Implement game status messages for turns, eliminations, and game end
  - Add Exploding Kitten placement interface for position selection (top, middle, bottom)
  - Use Tailwind CSS for consistent styling and clear visual hierarchy
- **Requirements**: Requirement 4 (Acceptance Criteria 3, 5), Requirement 3 (Acceptance Criteria 2)

## Phase 4: Integration and Application Setup

### 4.1 React Client Configuration and App Integration
- [ ] **Deliverable**: Complete application setup with boardgame.io React Client
- **Implementation Details**:
  - Update `src/App.jsx` with boardgame.io Client configuration
  - Configure game import, component props passing, and proper client setup
  - Add error boundary for graceful error handling
  - Implement proper component mounting and boardgame.io integration
  - Ensure hot reload compatibility with Vite development server
- **Requirements**: All requirements integration testing

### 4.2 Exploding Kitten Placement UI and Special Interactions
- [ ] **Deliverable**: Special UI for Exploding Kitten placement with user interaction
- **Implementation Details**:
  - Create modal or inline interface for Exploding Kitten deck placement
  - Add position selection buttons (top, middle, bottom, or specific position)
  - Implement `moves.placeExplodingKitten(position)` integration
  - Handle CPU automatic placement with visual feedback
  - Use Tailwind CSS for modal styling and clear interaction design
- **Requirements**: Requirement 3 (Acceptance Criteria 2, 5)

### 4.3 Final Integration Testing and Game Flow Validation
- [ ] **Deliverable**: Complete working game with full functionality and edge case handling
- **Implementation Details**:
  - Test complete game flow from initialization to game end
  - Validate all move sequences, turn transitions, and state updates
  - Test elimination scenarios, CPU behavior, and win conditions
  - Add any missing error handling for edge cases and invalid states
  - Ensure responsive design works across different screen sizes
- **Requirements**: All requirements validation and acceptance criteria verification

## Implementation Notes

### Development Workflow
1. **Setup**: Start development environment using `npm run dev`
2. **Foundation**: Implement card system and game definition first
3. **Dependencies First**: Complete boardgame.io integration before React components
4. **Integration**: Connect React components with boardgame.io state and moves
5. **Verification**: Test complete workflows manually in browser

### Common Commands
```bash
npm run dev          # Start Vite development server
npm run build        # Build production version
npm run preview      # Preview production build
npm install          # Install dependencies
npm run lint         # Run ESLint checks
```

### Quality Checklist

Before marking any task complete, ensure:
- [ ] Code compiles without errors using `npm run build`
- [ ] Code follows React and boardgame.io best practices
- [ ] Error handling follows project patterns
- [ ] No placeholder code or TODO comments remain
- [ ] Changes integrate smoothly with boardgame.io framework
- [ ] Performance is acceptable for real-time game play
- [ ] Responsive design works on mobile and desktop

## Success Criteria

### Phase Completion Validation
- **Phase 1**: Game initializes with proper boardgame.io state, 4 players, correct deck composition
- **Phase 2**: All moves work correctly, CPU players make decisions, elimination mechanics function
- **Phase 3**: Complete UI displays game state, accepts user input, integrates with boardgame.io
- **Phase 4**: Full game playable from start to finish with proper win conditions and error handling

### Final Acceptance
- [ ] Game supports exactly 4 players (1 human, 3 CPU) as specified
- [ ] All card types (Regular, Exploding Kitten, Defuse) work correctly
- [ ] Turn-based gameplay with proper validation and state management
- [ ] CPU players make reasonable decisions within 1-3 seconds
- [ ] Complete UI showing all necessary game information
- [ ] Game ends properly with winner declaration
- [ ] All requirements and acceptance criteria are met