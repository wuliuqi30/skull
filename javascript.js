


// Objects: 

const phases = {
    placingDiscs: "placingDiscs",
    challenge: "challenge",
    flippingCards: "flippingCards"
};

// Game: Represents the overall game
//  players: a list of player objects representing the players
//  turn: which player whose turn it is.
let game = {
    players: [],  // an array of all the player objects
    remainingPlayers: [], // an array of all players not ejected yet from the game
    numPlayers: 0,
    numRemainingPlayers: 0,

    turn: 0,  // an integer representing whose turn it is. 1-indexed
    totalTurns: 0, // total number of turns taken so far
    phase: "placingDiscs",

    challenge: 0,  // Number of discs bid to be flipped
    challengePlayer: null, // Current player with the bid

    numPlayersNotPassed: 0, // Number of players who HAVE NOT passed and still in the round

    numFlowersFlipped: 0, // Number of flowers the challenger has validly flipped over
    skullRevealed: false,
    winner: null,

}

// Increment the turn to the next player
function nextTurn() {
    // game.turn = game.numPlayers
}

// Player Object: 
// fields: 
//     name: 
//     design: the design style of the disc 
//     hand: array, an array of the cards in your hand. 
//     mat: boolean, can be 0 (unflipped) or flipped (1)
//     mat-cards: array, the cards on the mat, [0] being on the bottom, the higher numbers on top

function Player(number, name, design) {
    this.number = number;
    this.name = name;
    this.design = design;
    this.hand = ["skull", "flower", "flower", "flower"]
    this.mat = []; // 0 for unflipped, 1 for flipped
    this.pass = false;
    this.ejected = false; // Player has been ejected from the game from running out of discs
}



function placeCardOnMat(player, card) {
    // remove the card from player's hand array  and put on the mat array of the player
    // if the card doesn't exist in the player's hand, return 0, if it does, return 1
}




// Card: 
//   fields: 
//     type: "skull" or "flower"




function startGame() {
    // Initializations: 
    // game.numRemainingPlayers = game.numPlayers;
    
    game.remainingPlayers = game.players;
    // Play Rounds
    while (!game.winner) {
        // While there is not a winner, keep playing rounds. 

        // game.numPlayersNotPassed = game.numPlayers;

        while (game.phase === phase.placingDiscs) {
            // Players place discs one by one
            // Starting with the starting player, 

            // For first {numRemainingPlayers} rounds, each person places a 
            // single disc to start

            // After returning to the start player once more, 
            // They now have two options. Place another disc, or make a bid

            // if they place a disc, increment to next player

            // if they make a challenge, game.phase = phase.makingBids, challengePlayer = player, and it will exit the loop 
        }

        // Making a challenge phase:
        while (game.phase === phase.challenge) {
            // Players raise bids one by one

            // Starting with the player after bidPlayer, can raise the bid.

            //if they raise the challenge, player = challengePlayer, challenge increases

            // if they do not raise the challenge, they pass. player.pass = true.
            // 
            // game.numRemainingPlayers--
            // if (game.numRemainingPlayers === 0){
            //    game.phase = phase.flippingCards; }
        }


        // Revealing Discs Phase
        while (!game.skullRevealed) {

            // Starting with the challenge player, they get to click on different
            // players. 

            game.numFlowersFlipped = 0;

            // Flip a player's card

            revealedDisc = flipPlayerDisc(player);

            if (revealedDisc === "skull"){
                game.skullRevealed = true;

                // challenger loses a random disc
                player.removeRandomDisc();

                // if player has no cards left, 
                
                // remove from game.activePlayers
                // game.remainingPlayers 

            } else {
                game.numFlowersFlipped++;
            }

            if (game.numFlowersFlipped >= game. challenge){
                if (player.mat){ // Player's Mat was already flipped, he/she wins!
                    game.winner = player;
                } else {  // Player hadn't yet flipped her mat, flip now. 
                    player.mat = 1;
                }

                break;
            }

            // Alright hersh, bonter... Oh i got it, I got it, Say what you WakeLockSentinel. 
        }

    }
}