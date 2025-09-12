# Card Game - Exploding Kittens Clone

A web-based card game clone of Exploding Kittens mechanics, built with React, Vite, Tailwind CSS, and boardgame.io.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173/` to see the game.

## 🛠 Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3.4
- **Game Engine**: boardgame.io 0.50
- **Language**: JavaScript (ES6+)
- **AI Opponents**: Custom ThinkingBot with MCTS

## 🎮 Game Features (Implemented)

✅ **Core Gameplay**
- 4-player game (1 human vs 3 CPU players)
- Complete Exploding Kittens card mechanics
- All standard card types (Exploding, Defuse, Attack, Skip, Favor, Shuffle, See Future, Cat cards)
- Win/lose conditions with game over modal

✅ **AI System**
- Multiple AI personalities (Fast, Normal, Slow thinking speeds)
- MCTS-based decision making
- Natural gameplay with thinking delays

✅ **UI Components**
- Interactive player hand management
- Target selection for card effects
- Modal dialogs for special actions
- Real-time game state updates
- Error boundaries and debugging tools

## 📁 Project Structure

```
src/
├── components/         # React components (12 components)
│   ├── CardGame.jsx    # Main game wrapper
│   ├── GameBoard.jsx   # Primary game board
│   ├── PlayerHand.jsx  # Player hand management
│   ├── GameArea.jsx    # Central game area
│   ├── GameStatus.jsx  # Turn/status display
│   ├── OtherPlayers.jsx # AI player displays
│   ├── SeeTheFutureModal.jsx # Card preview modal
│   ├── GameOverModal.jsx # End game modal
│   ├── ExplodingKittenPlacement.jsx # Defuse mechanics
│   ├── CatPairSelection.jsx # Cat card pairing
│   ├── PlayerTargetSelection.jsx # Target selection
│   └── ErrorBoundary.jsx # Error handling
├── game/
│   └── index.js        # Complete boardgame.io game logic
├── ai/
│   └── ThinkingBot.js  # AI implementation with thinking delays
├── constants/
│   └── cards.js        # Card definitions and deck setup
└── assets/             # React assets
```

## 🎯 Current Status

✅ **Completed Features**
- React + Vite + Tailwind CSS setup
- Full boardgame.io integration with Local multiplayer
- Complete game logic implementation (580+ lines)
- Card system with 8 card types and deck management
- AI opponents with thinking behaviors
- 12 React components for complete UI
- Game state management and error handling
- Modal dialogs and interactive elements

🎮 **Game is Fully Playable**
- All core mechanics implemented
- Complete card interactions
- AI vs Human gameplay working
- Win/lose conditions functional

🔧 **Potential Improvements**
- Card animations and visual effects
- Sound effects
- Mobile responsiveness
- Additional game modes  

## 🎨 Development

### Available Scripts

- `npm run dev` - Start development server (http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

### Game Implementation Details

**Card Types Implemented:**
- 🎯 **Exploding Kittens** (3 cards) - Eliminate players
- 🛡️ **Defuse Cards** (6 cards) - Neutralize exploding kittens
- ⚡ **Attack Cards** (4 cards) - Force opponent to take 2 turns
- ⏭️ **Skip Cards** (4 cards) - End turn without drawing
- 🤝 **Favor Cards** (4 cards) - Take card from another player
- 🔀 **Shuffle Cards** (4 cards) - Shuffle the deck
- 👁️ **See Future Cards** (5 cards) - Preview top 3 deck cards
- 🐱 **Cat Cards** (20 cards) - Collect pairs for favors

**AI Behavior:**
- **ThinkingBot**: Normal-speed decisions (1-3 seconds)
- **FastThinkingBot**: Quick decisions (0.5-2 seconds)
- **SlowThinkingBot**: Deliberate decisions (2-5 seconds)

### Game Rules (Exploding Kittens Clone)

1. **Objective**: Be the last player standing
2. **Setup**: Each player gets defuse cards + random cards
3. **Gameplay**: Players take turns drawing cards
4. **Exploding Cards**: Eliminate players unless they have defuse cards
5. **Action Cards**: Various effects to disrupt opponents
6. **Victory**: Last player remaining wins

## 📝 License

This project is for educational purposes.
