# Requirements Document - Phase 1: Core Game Foundation

## Introduction

Phase 1 establishes the fundamental foundation for the Exploding Kittens web game using boardgame.io and React. This phase focuses on creating the essential gameplay loop where players take turns playing cards or drawing from the deck, with the core tension of avoiding Exploding Kitten cards. The primary goal is to build a minimal viable game that demonstrates the basic mechanics without complex interactions or advanced features.

This phase deliberately avoids "boiling the ocean" by implementing only the most essential cards and mechanics: regular cards, Exploding Kittens, and Defuse cards. The resulting game will be playable and testable, providing the foundation for all subsequent phases to build upon without requiring refactoring.

The system will support exactly 4 players (1 human player and 3 basic CPU players) and establish the core game state management that will accommodate future features like advanced action cards, player interactions, and sophisticated AI opponents.

## Requirements

### Requirement 1: Basic Game Setup and Initialization

**User Story:** As a player, I want the game to automatically set up a 4-player Exploding Kittens game with the correct deck composition and initial hand distribution, so that I can start playing immediately without manual configuration.

#### Acceptance Criteria

1. WHEN the game initializes THEN the system SHALL create exactly 4 players (1 human player labeled "You" and 3 CPU players labeled "CPU 1", "CPU 2", "CPU 3")
2. WHEN setting up the deck THEN the system SHALL include 3 Exploding Kitten cards, 6 Defuse cards, and 47 regular cards for a total of 56 cards
3. WHEN dealing initial hands THEN the system SHALL give each player exactly 1 Defuse card and 7 regular cards (8 total cards per player)
4. WHEN shuffling the remaining deck THEN the system SHALL add the remaining 2 Defuse cards and 3 Exploding Kitten cards to create a 24-card draw pile
5. WHEN the game starts THEN the system SHALL randomly determine which player goes first
6. WHEN displaying the initial game state THEN the system SHALL show the human player's complete hand and indicate it's ready for the first turn

### Requirement 2: Core Turn-Based Gameplay Loop

**User Story:** As a player, I want to take turns where I can either play cards from my hand or draw a card to end my turn, so that I can make strategic decisions while progressing through the game.

#### Acceptance Criteria

1. WHEN it's a player's turn THEN the system SHALL clearly indicate whose turn it is and allow only that player to take actions
2. WHEN a player chooses to play a card THEN the system SHALL move the card to the discard pile and allow the player to continue playing more cards or end their turn
3. WHEN a player chooses to draw a card THEN the system SHALL move the top card from the draw pile to the player's hand and immediately end their turn
4. WHEN a player draws a card THEN the system SHALL advance to the next player's turn automatically
5. WHEN playing cards during a turn THEN the system SHALL NOT automatically end the turn (players must explicitly draw or use a turn-ending action)
6. WHEN the draw pile is empty and no Exploding Kittens remain in play THEN the system SHALL declare all remaining players as winners

### Requirement 3: Exploding Kitten and Defuse Mechanics

**User Story:** As a player, I want the Exploding Kitten cards to create immediate danger that can only be avoided with Defuse cards, so that I experience the core tension and elimination mechanic of the game.

#### Acceptance Criteria

1. WHEN a player draws an Exploding Kitten card THEN the system SHALL immediately check if the player has a Defuse card in their hand
2. WHEN a player draws an Exploding Kitten and has a Defuse card THEN the system SHALL automatically use the Defuse card, discard it permanently, and allow the player to place the Exploding Kitten back into the deck at any position
3. WHEN a player draws an Exploding Kitten and has no Defuse card THEN the system SHALL immediately eliminate that player from the game
4. WHEN a player is eliminated THEN the system SHALL remove them from the turn order and display their elimination status
5. WHEN placing a defused Exploding Kitten back into the deck THEN the system SHALL provide the human player with a simple interface to choose the position (top, middle, bottom, or specific position)
6. WHEN only one player remains alive THEN the system SHALL declare that player the winner and end the game

### Requirement 4: Basic User Interface and Game State Display

**User Story:** As a player, I want to clearly see the current game state including my hand, other players' card counts, and whose turn it is, so that I can make informed decisions during gameplay.

#### Acceptance Criteria

1. WHEN viewing the game THEN the system SHALL display the human player's complete hand with all cards clearly visible and interactable
2. WHEN displaying other players THEN the system SHALL show their names, card counts, and elimination status without revealing specific cards
3. WHEN showing the game board THEN the system SHALL display the draw pile card count, discard pile with the top card visible, and current turn indicator
4. WHEN a player is taking their turn THEN the system SHALL highlight that player and provide clear action options (play card or draw card)
5. WHEN cards are played or drawn THEN the system SHALL update all relevant displays immediately to reflect the new game state
6. WHEN the game ends THEN the system SHALL display the winner clearly and provide an option to start a new game

### Requirement 5: Basic CPU Player Behavior

**User Story:** As a player, I want the CPU opponents to make reasonable decisions and play at an appropriate pace, so that I have engaging opponents without long waiting periods.

#### Acceptance Criteria

1. WHEN it's a CPU player's turn THEN the system SHALL automatically make decisions within 1-3 seconds to maintain game flow
2. WHEN a CPU player has regular cards THEN the system SHALL randomly choose to either play a card or draw from the deck
3. WHEN a CPU player draws an Exploding Kitten and has a Defuse card THEN the system SHALL automatically use the Defuse and place the Exploding Kitten at a random position in the deck
4. WHEN a CPU player is eliminated THEN the system SHALL display a brief notification and continue with the remaining players
5. WHEN a CPU player draws an Exploding Kitten without a Defuse THEN the system SHALL eliminate them immediately and advance to the next player
6. WHEN all CPU players are eliminated THEN the system SHALL declare the human player the winner