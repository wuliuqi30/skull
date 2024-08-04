
const SKULL = 'skull';
const FLOWER = 'flower';


// Objects: 

const phases = {
    placingDiscs: "placingDiscs",
    makingBids: "makingBids",
    executingChallenge: "executingChallenge"
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
    totalDiscsPlayed: 0, // total number of turns taken so far
    phase: "placingDiscs",

    challenge: 0,  // Current bid. Number of flowers the challenger says they can flip
    challengePlayer: null, // Current player with the bid

    numPlayersNotPassed: 0, // Number of players who HAVE NOT passed and still in the round

    numFlowersRevealed: 0, // Number of flowers the challenger has validly flipped over
    skullRevealed: false,
    winner: null,
    incrementTurn() {
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
    this.allDiscs = [];
    this.mat = [];
    this.matFlipped = 0;
    this.pass = false;
    this.ejected = false; // Player has been ejected from the game from running out of discs
    this.initializeAllDiscs = function () {
        for (let i = 0; i <= 2; i++) {
            let disc = new Disc(FLOWER, i);
            this.allDiscs.push(disc);
        }
        let disc = new Disc(SKULL, 3);
        this.allDiscs.push(disc);
        this.hand = this.allDiscs;
    }
    this.resetHand = function(){
        this.hand = this.allDiscs;
    }
    this.discardRandomDisc = function () {
        let randomIndex = getRandomInteger(this.allDiscs.length);
        this.allDiscs.splice(randomIndex, 1);
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
    game.numPlayersNotPassed = numPlayers;
    // Make the players
    for (let i = 0; i < numPlayers; i++) {
        game.players[i] = new Player(i, `Player ${i}`, "design");
        game.players[i].initializeAllDiscs();
        console.log(`Making player ${i} : ${game.players[i]}`);
    }

    // Set Up the player display for the first player: 
    setUpPlayerDisplay(chooseFirstPlayer(numPlayers));
    refreshGameDisplay();
}


function setUpPlayerDisplay() {
    let player = game.players[game.currentPlayerturn];
    // If this player has passed, skip their turn and move to the next turn: 
    if (player.pass) {
        console.log(`${player.name} has already passed, skipping`)
        game.incrementTurn();
        setUpPlayerDisplay();
    }

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
        if (game.phase === phases.placingDiscs) {
            discDOM.addEventListener("click", () => {
                // Put this on the mat and remove it from the hand.
                const discId = discDOM.value;
                //find the disc in player.hand whose id matches discId
                let thisDiscIdx = player.hand.findIndex(item => item.id === Number(discId));
                if (thisDiscIdx < 0) {
                    console.log("Couldn't find a disc in the hand that matchs the ID of this DOM element!")
                } else {
                    let removedDisc = player.hand.splice(thisDiscIdx, 1);
                    player.mat.push(...removedDisc);
                    discDOM.remove();
                    refreshGameDisplay();

                    // Now its the next player's turn: 
                    game.totalDiscsPlayed++;
                    game.incrementTurn();
                    setUpPlayerDisplay();
                }

            })
        }

        playerDisplayDOM.appendChild(discDOM);
    }
    playerDisplaySection.appendChild(playerDisplayDOM);


    if ((game.phase === phases.placingDiscs) && game.totalDiscsPlayed >= game.numPlayers) {
        // Add another box/button for making a bid.
        const startChallengeLabel = document.createElement("label");
        startChallengeLabel.setAttribute("for", "startChallenge");
        startChallengeLabel.textContent = "Start the Challenge?";
        playerDisplaySection.appendChild(startChallengeLabel);

        const startChallengeSelect = document.createElement("select");
        startChallengeSelect.setAttribute("name", "startChallenge");
        startChallengeSelect.setAttribute("id", "startChallenge");
        playerDisplaySection.appendChild(startChallengeSelect);

        for (let c = (player.mat.length + 1); c <= game.totalDiscsPlayed; c++) {
            const op = document.createElement("option");
            op.setAttribute("value", c);
            op.textContent = `${c}`;
            startChallengeSelect.appendChild(op);
        }


        startChallengeSelect.addEventListener("click", (event) => {
            game.challenge = Number(startChallengeSelect.value);
            game.challengePlayer = player;

            console.log(`Starting bid with ${game.challenge}`);
            const challengeDisplayText = document.createElement("p");
            challengeDisplayText.textContent = `Current Challenge by player ${player.name}:`
            challengeDisplayText.setAttribute("id", "challengeDisplayText");

            const challengeDisplay = document.createElement("p");
            challengeDisplay.setAttribute("id", "challengeDisplay")

            challengeDisplay.textContent = startChallengeSelect.value;
            header.appendChild(challengeDisplayText);
            header.appendChild(challengeDisplay);

            if (startChallengeSelect.value < game.totalDiscsPlayed) {
                game.phase = phases.makingBids;

                game.incrementTurn();
                setUpPlayerDisplay(); // Next Player
            } else {
                game.phase = phases.executingChallenge; // No more players take turns, now we enter the flipping over cards to win phase.
                setUpPlayerDisplay(); // Move to next player without incrementing turn, the same player will start their turn. 
            }
        })
    }

    if (game.phase === phases.makingBids) {


        // add  box/button for raising the bid.
        const raiseChallengeLabel = document.createElement("label");
        raiseChallengeLabel.setAttribute("for", "raiseChallenge");
        raiseChallengeLabel.textContent = "Raise the bid?";
        playerDisplaySection.appendChild(raiseChallengeLabel);

        const raiseChallengeSelect = document.createElement("select");
        raiseChallengeSelect.setAttribute("name", "raiseChallenge");
        raiseChallengeSelect.setAttribute("id", "raiseChallenge");
        playerDisplaySection.appendChild(raiseChallengeSelect);

        for (let c = (game.challenge + 1); c <= game.totalDiscsPlayed; c++) {
            const op = document.createElement("option");
            op.setAttribute("value", c);
            op.textContent = `${c}`;
            raiseChallengeSelect.appendChild(op);
        }


        raiseChallengeSelect.addEventListener("click", (event) => {
            game.challenge = Number(raiseChallengeSelect.value);
            game.challengePlayer = player;
            console.log(`Raising bid with ${game.challenge}`);
            const challengeDisplayText = document.getElementById("challengeDisplayText")
            challengeDisplayText.textContent = `${player.name} raised challenge to:`
            const challengeDisplay = document.getElementById("challengeDisplay")
            challengeDisplay.textContent = raiseChallengeSelect.value;

            if (game.challenge < game.totalDiscsPlayed) {

                game.incrementTurn();
                setUpPlayerDisplay(); // Next Player
            } else {
                game.phase = phases.executingChallenge; // No more players take turns, now we enter the flipping over cards to win phase.
                setUpPlayerDisplay(); // Move to next player without incrementing turn, the same player will start their turn. 
            }
        })

        // Pass option:
        const passButton = document.createElement("button");
        passButton.textContent = "Pass";
        playerDisplaySection.appendChild(passButton);

        passButton.addEventListener("click", (event) => {
            // If they pass:
            player.pass = true;
            game.numPlayersNotPassed--;
            const playerName = document.querySelector(`#p${player.number} .table-display-player-name`);
            playerName.textContent = `${player.name} (passed)`;

            if (game.numPlayersNotPassed > 1) {
                game.incrementTurn();
                setUpPlayerDisplay();
            } else {
                game.phase = phases.executingChallenge;
                // Automatically set the turn to the challenger

                // FIX THIS: But we dont update the game display properly
                refreshGameDisplay()
                game.currentPlayerturn = game.challengePlayer.number;
                setUpPlayerDisplay();

            }
        })

    }

    if (game.phase === phases.executingChallenge) {

        const challengeDisplayText = document.getElementById("challengeDisplay");
        challengeDisplayText.textContent = `${player.name} is now executing the challenge, he/she must flip over ${game.challenge} flower cards!`;

    }



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

function deleteGameDisplay() {
    let child = gameDisplay.lastElementChild;
    while (child) {
        gameDisplay.removeChild(child);
        child = gameDisplay.lastElementChild;
    }
}

function placePlayerIntoGameDisplay(player) {
    const tableDisplayPlayer = document.createElement("div");
    tableDisplayPlayer.classList.add("table-display-player");
    tableDisplayPlayer.setAttribute("id", `p${player.number}`);
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

        // Put event listeners on these discs but they'll do nothing until the final stage: 

        matDisc.addEventListener("click", (event) => {

            // Must be in the executing challenge phase AND it must be a skull that hasn't been clicked, and it mustbe on the top.

            if ((game.phase === phases.executingChallenge) 
            && ( (matDisc.nextElementSibling === null) || (matDisc.nextElementSibling.classList.contains("revealed")) ) 
        && !matDisc.classList.contains("revealed")) {
                // When you click it, add a "revealed" class to it and that will apply the appropriate styling
                const challengeDisplayText = document.getElementById("challengeDisplayText")


                matDisc.classList.add("revealed");

                // If skull:
                if (matDisc.classList.contains(SKULL)) {
                    game.skullRevealed = true;
                    challengeDisplayText.textContent = `${player.name} revealed a skull, he/she dies!`;
                    player.discardRandomDisc();
                    // CHECK does he/she have discs
                    if (!player.allDiscs.length){
                        // Player ran out of discs. Remove this player from the "players" list
                        game.players.splice(player.number,1);
                    }
                    resetForNewRound();
                } else if (matDisc.classList.contains(FLOWER)) {

                    game.numFlowersRevealed++;
                    if (game.numFlowersRevealed < game.challenge) {
                        challengeDisplayText.textContent = `${player.name} revealed a flower! So far revealed ${game.numFlowersRevealed}/${game.challenge} flowers`;
                    
                    } else {
                        
                        if (player.matFlipped){
                            challengeDisplayText.textContent = `${player.name} wins the game! Revealed ${game.numFlowersRevealed}/${game.challenge} flowers! and Flips his mat the second time!`;
                        } else {
                            challengeDisplayText.textContent = `${player.name} wins! Revealed ${game.numFlowersRevealed}/${game.challenge} flowers! Flips his/her mat for the first time!`;
                            player.matFlipped = 1;
                            // re-set for new round
                            resetForNewRound();
                        }
                    }
                } else {
                    alert("something went wrong")
                }


            }
        })
    }


    const playerHand = document.createElement("p");
    playerHand.textContent = `Hand: ${player.getStringOfHand()}, Matt Flipped? ${player.matFlipped}`;
    playerHand.classList.add("table-display-player-hand")
    tableDisplayPlayer.appendChild(playerHand);


}

function resetForNewRound(){
    game.phase = phases.placingDiscs;
    game.numFlowersRevealed = 0;
    // FIX THIS
    game.currentPlayerturn =  0;
    game.numPlayers = game.players.length;
    game.totalDiscsPlayed = 0;
    game.challenge = 0;
    game.challengePlayer = null;
    game.numPlayersNotPassed = 0;
    game.numFlowersRevealed = 0;
    game.skullRevealed = false;
    playersResetHand();
    refreshGameDisplay();
    setUpPlayerDisplay();
}

function playersResetHand(){
    for (let i = 0; i < game.players.length; i++){
        game.players[i].resetHand();
        game.players[i].mat = [];
        game.players[i].passed = false;
        
    }
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
