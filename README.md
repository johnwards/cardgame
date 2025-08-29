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

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Game Engine**: boardgame.io
- **Language**: JavaScript (ES6+)

## 🎮 Game Features (Planned)

- 4-player game (1 human vs 3 CPU players)
- Exploding Kittens card mechanics
- Real-time game state management
- Simple AI opponents
- Card animations and effects

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Game/           # Main game container
│   ├── Board/          # Game board display
│   ├── Hand/           # Player hand component
│   ├── Card/           # Individual card component
│   ├── PlayerArea/     # Player info and status
│   └── UI/             # General UI components
├── game/               # boardgame.io game logic
│   ├── moves/          # Game moves/actions
│   ├── phases/         # Game phases
│   ├── cards/          # Card definitions and logic
│   └── ai/             # CPU player logic
├── utils/              # Utility functions
├── constants/          # Game constants
└── assets/             # Images and other assets
```

## 🎯 Current Status

✅ Project setup with React + Vite + Tailwind CSS  
✅ Basic "Hello Card Game" landing page  
✅ boardgame.io integration  
⏳ Game logic implementation (in progress)  
⏳ Card system implementation  
⏳ AI opponents  
⏳ UI/UX polish  

## 🎨 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Game Rules (Exploding Kittens Clone)

1. **Objective**: Be the last player standing
2. **Setup**: Each player gets defuse cards + random cards
3. **Gameplay**: Players take turns drawing cards
4. **Exploding Cards**: Eliminate players unless they have defuse cards
5. **Action Cards**: Various effects to disrupt opponents
6. **Victory**: Last player remaining wins

## 📝 License

This project is for educational purposes.
