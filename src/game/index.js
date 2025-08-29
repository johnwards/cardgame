// Basic boardgame.io game setup for Exploding Kittens clone

const CardGame = {
  name: 'exploding-kittens-clone',

  setup: () => ({
    deck: [],
    players: {},
    discardPile: [],
    currentPlayer: 0,
    gamePhase: 'setup'
  }),

  moves: {
    // Game moves will be implemented here
    drawCard: (G, ctx) => {
      // TODO: Implement draw card logic
      console.log('Draw card move triggered');
      return G;
    },

    playCard: (G, ctx, cardIndex) => {
      // TODO: Implement play card logic
      console.log('Play card move triggered:', cardIndex);
      return G;
    }
  },

  endIf: (G, ctx) => {
    // TODO: Implement win condition
    return null;
  },

  minPlayers: 2,
  maxPlayers: 4
};

export default CardGame;