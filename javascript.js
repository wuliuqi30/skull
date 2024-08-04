
const SKULL = 'skull';
const FLOWER = 'flower';


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

    currentPlayerturn: 0,  // an integer representing whose turn it is. 1-indexed
    totalTurns: 0, // total number of turns taken so far
    phase: "placingDiscs",

    challenge: 0,  // Number of discs bid to be flipped
    challengePlayer: null, // Current player with the bid

    numPlayersNotPassed: 0, // Number of players who HAVE NOT passed and still in the round

    numFlowersFlipped: 0, // Number of flowers the challenger has validly flipped over
    skullRevealed: false,
    winner: null,
    incrementTurn(){
        this.currentPlayerturn = (this.currentPlayerturn + 1) % this.numPlayers;
    }

}



// Player Object: 
// fields: 
//     name: 
//     design: the design style of the disc 
//     hand: array, an array of the cards in your hand. 
//     mat: boolean, can be 0 (unflipped) or flipped (1)
//     mat-cards: array, the cards on the mat, [0] being on the bottom, the higher numbers on top

function Disc(type, id) {
    // type is skull or flower
    this.type = type;
    this.id = id; // the "id" here will correspond to the DOM element's "value"
    if (type === SKULL) {
        this.letter = "S";
    } else {
        this.letter = "F"
    };
}


function Player(number, name, design) {
    this.number = number;
    this.name = name;
    this.design = design;
    this.hand = [];
    this.mat = [];
    this.pass = false;
    this.ejected = false; // Player has been ejected from the game from running out of discs
    this.initializeHand = function () {
        for (let i = 0; i <= 2; i++) {
            let disc = new Disc(FLOWER, i);
            this.hand.push(disc);
        }
        let disc = new Disc(SKULL, 3);
        this.hand.push(disc);

    }
    this.discardRandomDisc = function () {
        let randomIndex = getRandomInteger(this.hand.length);
        this.hand.splice(randomIndex, 1);
    }
    this.getStringOfHand = function () {
        let stringOut = ''
        for (let i = 0; i < this.hand.length; i++) {
            stringOut += this.hand[i].letter;
        }
        return stringOut;
    }
}

function getRandomInteger(n) {
    // get random integer from 0 to n-1
    return Math.floor(Math.random() * (n - 1));
}

function chooseFirstPlayer(n) {
    // Choose first player code here: 
    game.currentPlayerturn = getRandomInteger(n);

}

function placeCardOnMat(player, card) {
    // remove the card from player's hand array  and put on the mat array of the player
    // if the card doesn't exist in the player's hand, return 0, if it does, return 1
}





// Card: 
//   fields: 
//     type: "skull" or "flower"


const body = document.querySelector('body');
const header = document.querySelector('.header');
const gameDisplay = document.querySelector('.game-display');
const playerDisplaySection = document.querySelector('.player-display-section');

// Set up the header: 
const numPlayersSelect = document.querySelector('#numPlayers');
numPlayersSelect.addEventListener("click", (event) => {
    console.log("Clicked number of players Selection");
    initializeGame(numPlayersSelect.value);
    numPlayersSelect.disabled = true;
})
// A button along with a text box where you input the number then click "start game" which runs the initializeGame code below






function initializeGame(numPlayers) {
    // Create the players and put them in the game object
    game.numPlayers = numPlayers;
    // Make the players
    for (let i = 0; i < numPlayers; i++) {
        game.players[i] = new Player(i, `Player ${i}`, "design");
        game.players[i].initializeHand();
        console.log(`Making player ${i} : ${game.players[i]}`);
    }

    // Set Up the player display for the first player: 
    setUpPlayerDisplay(chooseFirstPlayer(numPlayers));
    refreshGameDisplay();
}


function setUpPlayerDisplay() {
    let player = game.players[game.currentPlayerturn];
    // Based on the discs the player currently has, create
    // the DOM elements and place them in the player screen.
    playerDisplaySection.textContent = player.name;
    const playerDisplayDOM = document.createElement("div");
    playerDisplayDOM.classList.add("player-display");
    for (i = 0; i < player.hand.length; i++) {
        const discDOM = document.createElement("button");
        discDOM.classList.add("disc", player.hand[i].type);
        discDOM.textContent = player.hand[i].type;
        discDOM.setAttribute("value", player.hand[i].id);

        discDOM.addEventListener("click", () => {
            // Put this on the mat and remove it from the hand.
            const discId = discDOM.value;
            //find the disc in player.hand whose id matches discId
            let thisDiscIdx = player.hand.findIndex(item => item.id === Number(discId));
            if (thisDiscIdx < 0) {
                console.log("Couldn't find a disc in the hand that matchs the ID of this DOM element!")
            } else {
                let removedDisc = player.hand.splice(thisDiscIdx,1);
                player.mat.push(...removedDisc);
                discDOM.remove();
                refreshGameDisplay();
                
                // Now its the next player's turn: 
                
                game.incrementTurn();
                setUpPlayerDisplay();
            }

        })

        playerDisplayDOM.appendChild(discDOM);
    }
    playerDisplaySection.appendChild(playerDisplayDOM);


}

function refreshGameDisplay() {
    // Delete the current contents of the game display and reset: 
    deleteGameDisplay();

    // Put each player's mat contents on to the middle display area. 
    // [Player Name] [Player Mat] [text box of cards in hand]
    // But only if that player has discs left in their hand.

    for (let i = 0; i < game.numPlayers; i++) {
        let displayPlayer = game.players[i];

        if (displayPlayer.hand) {
            // If hand is not empty:
            placePlayerIntoGameDisplay(game.players[i]);
        }
    }
}

function deleteGameDisplay(){
    let child = gameDisplay.lastElementChild;
    while(child){
        gameDisplay.removeChild(child);
        child = gameDisplay.lastElementChild;
    }
}

function placePlayerIntoGameDisplay(player) {
    const tableDisplayPlayer = document.createElement("div");
    tableDisplayPlayer.classList.add("table-display-player");
    gameDisplay.appendChild(tableDisplayPlayer);

    const playerName = document.createElement("p");
    playerName.textContent = player.name;
    playerName.classList.add("table-display-player-name");
    tableDisplayPlayer.appendChild(playerName);

    const playerMat = document.createElement("div");
    playerMat.classList.add("table-display-player-mat")
    tableDisplayPlayer.appendChild(playerMat);


    // Stack the discs:
    for (let d = 0; d < player.mat.length; d++) {
        const matDisc = document.createElement("button");
        matDisc.classList.add("disc", player.mat[d].type);
        matDisc.textContent = player.mat[d].type;
        playerMat.appendChild(matDisc);

        const discSize = matDisc.offsetWidth;
        //Place discs on mat
        const discOverlap = 0.5;
        matDisc.style.position = "absolute";
        matDisc.setAttribute("value", player.mat[d].id);
        matDisc.style.left = `${(d * discOverlap * discSize)}px`;
        
    }
    

    const playerHand = document.createElement("p");
    playerHand.textContent = `Hand: ${player.getStringOfHand()}`;
    playerHand.classList.add("table-display-player-hand")
    tableDisplayPlayer.appendChild(playerHand);

    
}



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

            if (revealedDisc === "skull") {
                game.skullRevealed = true;

                // challenger loses a random disc
                player.removeRandomDisc();

                // if player has no cards left, 

                // remove from game.activePlayers
                // game.remainingPlayers 

            } else {
                game.numFlowersFlipped++;
            }

            if (game.numFlowersFlipped >= game.challenge) {
                if (player.mat) { // Player's Mat was already flipped, he/she wins!
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



// Main Code
