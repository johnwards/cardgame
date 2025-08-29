# Exploding Kittens Game Rules & Logic

## Game Overview

Exploding Kittens is a strategic card game where players try to avoid drawing Exploding Kitten cards while using various action cards to manipulate the deck and target other players. The last player remaining wins the game.

**Web Game Setup**: This implementation features exactly 4 players - 1 human player and 3 CPU opponents.

## Setup

### Number of Players
- **Fixed at 4 players**: 1 human player + 3 CPU players

### Deck Composition (4 Players)
- **Exploding Kittens**: 3 cards (4 players - 1)
- **Defuse Cards**: 6 total (each player starts with 1, remaining 2 shuffled into deck)
- **Action Cards**: 56 cards total
  - **Attack Cards**: 4 cards
  - **Skip Cards**: 4 cards
  - **Favor Cards**: 4 cards
  - **Shuffle Cards**: 4 cards
  - **See the Future Cards**: 5 cards
  - **Cat Cards**: 20 cards (4 each of 5 different types)
    - Tacocat (4)
    - Rainbow-ralphing Cat (4)
    - Potato Cat (4)
    - Beard Cat (4)
    - Cattermelon (4)
  - **Nope Cards**: 5 cards

### Initial Setup
1. Remove all Exploding Kittens and Defuse cards from deck
2. Deal 1 Defuse card to each of the 4 players (human + 3 CPUs)
3. Deal 7 additional cards to each player (8 cards total per player)
4. Shuffle remaining 2 Defuse cards back into the deck
5. Insert 3 Exploding Kittens into the deck
6. Shuffle the deck thoroughly

## Game Flow

### Turn Structure
On your turn, you have two options:

**Option 1: Play Cards**
- Play any card from your hand face up on the discard pile
- Follow the instructions on the card
- You may continue playing as many cards as you want

**Option 2: End Your Turn**
- Draw exactly 1 card from the top of the draw pile
- Drawing a card ALWAYS ends your turn
- Hope it's not an Exploding Kitten!

### Important Turn Rules
- **Playing cards does NOT end your turn** (unless the card says it does)
- **Drawing a card ALWAYS ends your turn**
- **You normally end your turn by drawing a card**
- **You cannot draw a card and then play more cards**

### Special Turn Modifications
- **Attack Card**: Forces the next player to take 2 turns instead of 1
- **Skip Card**: Ends your turn immediately without drawing a card

## Card Types & Effects

### Exploding Kitten Cards
- **Effect**: Player who draws this card explodes and is eliminated
- **Defense**: Can only be defused with a Defuse card
- **After Defusing**: Player must place the Exploding Kitten back into the deck at any position of their choice

### Defuse Cards
- **Effect**: Neutralizes an Exploding Kitten
- **Usage**: Play immediately when you draw an Exploding Kitten
- **After Use**: Card is discarded permanently

### Action Cards

#### Attack Cards
- **Effect**: End your turn immediately and force the next player to take 2 turns
- **Stacking**: Multiple Attack cards can be stacked on one player
- **Turn Count**: Each Attack adds 1 additional turn to the target

#### Skip Cards
- **Effect**: End your turn immediately without drawing a card
- **Usage**: Can be used to avoid drawing or to skip one of multiple turns from an Attack

#### Favor Cards
- **Effect**: Force any other player to give you a card of their choice from their hand
- **Target**: You choose which player, they choose which card

#### Shuffle Cards
- **Effect**: Shuffle the deck thoroughly
- **Timing**: Can be played at any time during your turn

#### See the Future Cards
- **Effect**: Look at the top 3 cards of the deck
- **Information**: You may share or keep this information secret
- **Card Order**: Cards remain in the same order unless you play other cards

#### Cat Cards (Pairs/Sets)
- **Two of a Kind**: Play 2 matching cat cards to steal a random card from any player
- **Three of a Kind**: Play 3 matching cat cards to name a specific card and steal it from any player (if they have it)
- **Five Different Cats**: Play 5 different cat cards to steal any card from the discard pile

#### Nope Cards
- **Effect**: Stop any action card (except Exploding Kittens and Defuse cards)
- **Timing**: Can be played at any time by any player
- **Chaining**: Can be "Noped" by another Nope card
- **Target**: Stops the action and ends the chain

## Detailed Game Mechanics

### Drawing Cards
- Players end their turn by drawing exactly 1 card from the draw pile
- **Drawing always ends your turn** - you cannot play cards after drawing
- **You must draw to end your turn** unless you played a Skip card
- If a player draws an Exploding Kitten:
  1. They must immediately play a Defuse card (if they have one)
  2. If they have no Defuse card, they explode and are eliminated
  3. If they defuse it, they secretly place the Exploding Kitten anywhere in the deck
  4. Their turn ends (drawing the Exploding Kitten still ends the turn)

### Nope Card Interactions
- **Can Nope**: Attack, Skip, Favor, Shuffle, See the Future, Cat card combinations
- **Cannot Nope**: Exploding Kittens, Defuse cards, other Nope cards
- **Nope Chains**: Player A plays Favor → Player B plays Nope → Player C plays Nope (favor happens)

### Turn Order After Attacks
- If Player A attacks Player B, Player B takes 2 turns, then play continues to Player C
- If Player B plays Skip on their first turn, they still have 1 turn remaining
- If Player B plays Attack on their first turn, Player C takes 2 turns and Player B still has 1 turn remaining

### End Game Conditions
- **Victory**: Last player remaining alive wins
- **Draw Pile Empty**: If deck runs out and no Exploding Kittens remain, all surviving players win
- **Elimination**: Players are eliminated when they draw an Exploding Kitten without a Defuse card

## Strategy Notes

### Key Strategies
- **Defuse Management**: Always keep at least one Defuse card if possible
- **Information Control**: Use See the Future to gain advantage, decide whether to share info
- **Attack Timing**: Use Attack cards when you know dangerous cards are coming
- **Cat Card Collection**: Collect matching cats for targeted stealing
- **Nope Card Timing**: Save Nope cards for critical moments

### Risk Management
- **Monitor Exploding Kittens**: Keep track of how many are in play
- **Deck Position Knowledge**: Remember where Exploding Kittens were placed after defusing
- **Hand Size Management**: Balance between useful cards and hand size for Favor defense

## CPU Player Behavior

### CPU Difficulty Levels
- **Easy CPU**: Makes random legal moves, may make suboptimal decisions
- **Medium CPU**: Uses basic strategy (keeps Defuse cards, uses See the Future intelligently)
- **Hard CPU**: Advanced strategy (tracks cards, optimal timing, bluffing with information)

### CPU Decision Making
- **Card Play Priority**: Defuse cards are never played unless drawing Exploding Kitten
- **Attack Timing**: CPUs may use See the Future before deciding to Attack
- **Favor Targeting**: CPUs prefer targeting players with more cards
- **Cat Card Strategy**: CPUs collect matching cats when possible
- **Nope Usage**: CPUs save Nope cards for defending against direct attacks (Favor, Attack)

### Information Management
- CPUs will remember publicly revealed information (See the Future announcements)
- CPUs track which cards have been played and discarded
- Higher difficulty CPUs may bluff or mislead about See the Future information

## Implementation Notes for Development

### Game State Requirements
- Track all cards in each player's hand
- Track deck order (important for Exploding Kitten placement)
- Track discard pile
- Track current player and turn count
- Track pending turns from Attack cards

### Card Effect Resolution Order
1. Check for Nope cards (allow all players to respond)
2. Resolve Nope chain if applicable
3. Execute card effect if not noped
4. Handle any triggered effects (like drawing Exploding Kittens)

### Random Events Handling
- Deck shuffling must be truly random
- Card dealing must be fair
- Stolen "random" cards should be properly random

### UI/UX Considerations
- **Human Player Hand**: Cards should be clearly visible and draggable/clickable
- **CPU Player Indicators**: Show CPU player names, card counts, and current turn
- **Deck Count**: Display remaining cards in deck
- **Recent Plays**: Show last few actions in a game log
- **Turn Order**: Clear indication of whose turn it is and any pending multiple turns
- **Nope Opportunities**: Modal or popup system for Nope card timing windows
- **Game State**: Visual indicators for eliminated players and game progress

### Web Game Specific Features
- **Pause/Resume**: Allow human player to pause game
- **Speed Controls**: Adjustable CPU turn speed for better user experience
- **Animation**: Smooth card movements and effects for visual appeal
- **Sound Effects**: Optional sound cues for card plays and explosions
- **Statistics**: Track wins/losses against CPU opponents
- **Difficulty Selection**: Let player choose CPU difficulty before starting

---

This document serves as the complete reference for implementing the Exploding Kittens game mechanics. All game logic should adhere to these rules to ensure proper gameplay experience.