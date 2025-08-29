
## Phased Development Plan for Exploding Kittens Web Game

Based on the game rules and your tech stack, here's a strategic breakdown that builds functional layers without requiring refactoring:

### **Phase 1: Core Game Foundation** 
**Outcome**: A working turn-based game with basic card mechanics

**Focus**: Establish the fundamental boardgame.io structure and basic gameplay loop
- Set up boardgame.io game definition with 4-player support
- Implement basic turn system (play cards OR draw card to end turn)
- Create simple deck management (draw pile, discard pile)
- Basic card types: Normal cards, Exploding Kittens, Defuse cards
- Core elimination mechanic (draw Exploding Kitten = game over unless you have Defuse)
- Simple React UI showing: player hands, deck count, current turn indicator
- Victory condition: last player standing wins

**What you can test**: The core tension of the game - avoiding Exploding Kittens while managing your hand.

### **Phase 2: Essential Action Cards**
**Outcome**: Strategic gameplay with the most impactful cards

**Focus**: Add the cards that create the core strategic experience
- Attack cards (force next player to take 2 turns)
- Skip cards (end turn without drawing)
- See the Future cards (view top 3 cards)
- Basic turn queue system for handling multiple turns from attacks
- Enhanced UI showing pending turns and card effects

**What you can test**: The strategic layer emerges - players can now manipulate turn order and gain information, creating meaningful decisions.

### **Phase 3: Player Interaction Cards**
**Outcome**: Social gameplay elements that create player-vs-player dynamics

**Focus**: Cards that let players directly affect each other
- Favor cards (force another player to give you a card)
- Cat card pairs (2 matching = steal random card, 3 matching = steal specific card)
- Target selection UI for interactive cards
- Hand size indicators for all players

**What you can test**: The social manipulation aspect - players can now directly impact each other's strategies and resources.

### **Phase 4: Advanced Mechanics & Polish**
**Outcome**: Complete game with all rules and quality-of-life features

**Focus**: Remaining mechanics and game refinement
- Nope cards and the Nope chain system (real-time interruption mechanics)
- 5 different cats combo (steal from discard pile)
- Shuffle cards
- Strategic Exploding Kitten placement after defusing
- Game state persistence and replay functionality

**What you can test**: The full complexity of the game with all interaction patterns and edge cases.

### **Phase 5: AI & User Experience**
**Outcome**: Polished game ready for extended play

**Focus**: CPU opponents and enhanced user experience
- CPU player AI with different difficulty levels
- Game animations and visual polish
- Sound effects and visual feedback
- Statistics tracking (wins/losses)
- Speed controls for CPU turns
- Improved mobile responsiveness

**What you can test**: The complete single-player experience against varied AI opponents with a polished interface.

### **Phase 6: Advanced Features** (Optional)
**Outcome**: Extended gameplay features for retention

**Focus**: Features that extend the game's lifespan
- Local multiplayer support (multiple humans)
- Game replay system
- Custom deck configurations
- Tournament mode
- Advanced AI personalities and strategies

## Key Architectural Decisions to Avoid Refactoring

1. **Card System**: Design cards as data objects with `type` and `effect` properties from Phase 1, so new card types just extend the existing structure.

2. **Player Actions**: Use a unified action system in boardgame.io where all card plays go through the same `playCard` move, with card-specific logic handled in the game state.

3. **Turn Management**: Build the turn queue system in Phase 2 to handle Attack cards, which naturally extends to handle Nope cards and other interruptions later.

4. **UI Components**: Create reusable card and player components from the start that can display any card type or player state.

5. **Game State Structure**: Design the game state to include all future needs (deck position tracking, pending effects, player targeting) even if not initially used.

