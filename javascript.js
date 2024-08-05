
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
    allPlayers: [],  // an array of all the player objects. Players are never removed from this. If a player loses all his discs, merely properties on the player object are altered. 
    numPlayers: 0,
    round: null,
}


function Round() {
    this.numPlayers = 0;
    this.players = [];
    this.playerTurnList = []; // an array holding the player IDs of all the players in this round, in ascedning order. Could be 1, 4, 5 if players 2 and 3 were eliminated.
    this.currentPlayerTurnId = 0;  // the player ID of the current player whose turn it is/will be next.
    this.currentPlayerTurnCounter = 0; // always goes from 0 to numplayers - 1
    this.totalDiscsPlayed = 0; // total number of turns taken so far
    this.phase = "placingDiscs";
    this.challenge = 0;  // Current bid. Number of flowers the challenger says they can flip
    this.challengePlayer = null; // Current player with the bid

    this.numPlayersNotPassed = 0; // Number of players who HAVE NOT passed and still in the round

    this.numFlowersRevealed = 0; // Number of flowers the challenger has validly flipped over
    this.skullRevealed = false;
    this.winner = null;
    this.incrementTurn = function () {
        this.currentPlayerTurnCounter = (this.currentPlayerTurnCounter + 1) % this.numPlayers;
        this.currentPlayerTurnId = this.playerTurnList[this.currentPlayerTurnCounter];
        return this.currentPlayerTurnId;
    };
    this.resetPlayers = function () {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].resetHand();
            this.players[i].mat = [];
            this.players[i].pass = false;
            
        }
    }
    this.resetTurnList = function () {
        for (let p = 0; p < this.numPlayers; p++) {
            this.playerTurnList[p] = this.players[p].id;
        }
    }
}


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


function Player(id, name, design) {
    this.id = id;
    this.name = name;
    this.design = design;
    this.hand = [];
    this.allDiscs = [];
    this.mat = [];
    this.matFlipped = 0;
    this.pass = false;
    this.numOwnDiscsRevealed = 0;
    this.revealedAllOwnDiscs = false;
    this.ejected = false; // Player has been ejected from the game from running out of discs
    this.initializeAllDiscs = function () {
        for (let i = 0; i <= 2; i++) {
            let disc = new Disc(FLOWER, i);
            this.allDiscs.push(disc);
        }
        let disc = new Disc(SKULL, 3);
        this.allDiscs.push(disc);
        this.resetHand();
    }
    this.resetHand = function () {
        this.hand = [...this.allDiscs];
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

function chooseFirstPlayerId(n) {
    // Choose first player code here: 
    // return game.round.players[getRandomInteger(n)].id;
    // HARD CODE TO 0 for now
    return game.round.players[2].id;

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
});

function resetChooseNumPlayers() {
    numPlayersSelect.disabled = false;
    
}


function initializeGame(numPlayers) {

    const headerDisplayText = document.getElementById("headerDisplayText");
    headerDisplayText.textContent = '';
    
    // Create the players and put them in the game object
    game.numPlayers = numPlayers;

    // Make the players for the entire game
    for (let i = 0; i < numPlayers; i++) {
        game.allPlayers[i] = new Player(i, `Player ${i + 1}`, "design");
        game.allPlayers[i].initializeAllDiscs();
        console.log(`Making player ${i} : ${game.allPlayers[i]}`);
    }

    // Setup the players for the first round:

    resetForNewRound(true);
}


function resetForNewRound(firstRound) {

    const lastRound = game.round;
    game.round = new Round();
    let startPlayer;

    // Put all players who are not "ejected" into the players for this round:
    if (!firstRound) {
        const newPLayers = lastRound.players.reduce(function (accumulator, player) {
            if (!player.ejected) {
                accumulator = [...accumulator, player];
            }
            return accumulator;
        }, [])
        game.round.players = [...newPLayers];
        game.round.currentPlayerTurnId =
            lastRound.challengePlayer.ejected === true ? chooseFirstPlayerId(game.round.players.length) : lastRound.challengePlayer.id;
    } else // If its the first round, the players for this round are just the original players
    {
        game.round.players = [...game.allPlayers];
        game.round.currentPlayerTurnId = chooseFirstPlayerId(game.round.players.length)

    }

    game.round.numPlayers = game.round.players.length;
    game.round.numPlayersNotPassed = game.round.numPlayers;

    game.round.resetPlayers();
    game.round.resetTurnList();

    game.round.currentPlayerTurnCounter = getIndexFromPlayerId(game.round.currentPlayerTurnId);

    loadPlayerControls(game.round.currentPlayerTurnId);
    refreshGameDisplay();


}

function getIndexFromPlayerId(pId) {
    return game.round.playerTurnList.indexOf(pId);

}


function loadPlayerControls(pId) {
    let player = game.round.players[getIndexFromPlayerId(pId)];
    // If this player has passed, skip their turn and move to the next turn: 
    if (player.pass) {
        console.log(`${player.name} has already passed, skipping`);
        loadPlayerControls(game.round.incrementTurn());
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
        if (game.round.phase === phases.placingDiscs) {
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
                    game.round.totalDiscsPlayed++;
                    loadPlayerControls(game.round.incrementTurn());
                }

            })
        }

        playerDisplayDOM.appendChild(discDOM);
    }
    playerDisplaySection.appendChild(playerDisplayDOM);


    if ((game.round.phase === phases.placingDiscs) && game.round.totalDiscsPlayed >= game.round.numPlayers) {
        // Add another box/button for making a bid.
        const startChallengeLabel = document.createElement("label");
        startChallengeLabel.setAttribute("for", "startChallenge");
        startChallengeLabel.textContent = "Start the Challenge?";
        playerDisplaySection.appendChild(startChallengeLabel);

        const startChallengeSelect = document.createElement("select");
        startChallengeSelect.setAttribute("name", "startChallenge");
        startChallengeSelect.setAttribute("id", "startChallenge");
        playerDisplaySection.appendChild(startChallengeSelect);

        for (let c = (player.mat.length + 1); c <= game.round.totalDiscsPlayed; c++) {
            const op = document.createElement("option");
            op.setAttribute("value", c);
            op.textContent = `${c}`;
            startChallengeSelect.appendChild(op);
        }


        startChallengeSelect.addEventListener("click", (event) => {
            game.round.challenge = Number(startChallengeSelect.value);
            game.round.challengePlayer = player;

            console.log(`Starting bid with ${game.round.challenge}`);
            const headerDisplayText = document.getElementById("headerDisplayText");
            headerDisplayText.textContent = `Current Challenge by player ${player.name}, bid is at ${startChallengeSelect.value}`
            header.appendChild(headerDisplayText);


            if (startChallengeSelect.value < game.round.totalDiscsPlayed) {
                game.round.phase = phases.makingBids;

                loadPlayerControls(game.round.incrementTurn()); // Next Player
            } else {
                game.round.phase = phases.executingChallenge; // No more players take turns, now we enter the flipping over cards to win phase.
                loadPlayerControls(game.round.currentPlayerTurnId); // Move to next player without incrementing turn, the same player will start their turn. 
            }
        })
    }

    if (game.round.phase === phases.makingBids) {


        // Create Input for raising the bid:
        const raiseChallengeLabel = document.createElement("label");
        raiseChallengeLabel.setAttribute("for", "raiseChallenge");
        raiseChallengeLabel.textContent = "Raise the bid?";
        playerDisplaySection.appendChild(raiseChallengeLabel);

        const raiseChallengeSelect = document.createElement("select");
        raiseChallengeSelect.setAttribute("name", "raiseChallenge");
        raiseChallengeSelect.setAttribute("id", "raiseChallenge");
        playerDisplaySection.appendChild(raiseChallengeSelect);

        // Drop-down for choosing how high to raise the bid.
        for (let c = (game.round.challenge + 1); c <= game.round.totalDiscsPlayed; c++) {
            const op = document.createElement("option");
            op.setAttribute("value", c);
            op.textContent = `${c}`;
            raiseChallengeSelect.appendChild(op);
        }

        raiseChallengeSelect.addEventListener("click", (event) => {
            game.round.challenge = Number(raiseChallengeSelect.value);
            game.round.challengePlayer = player;
            console.log(`Raising bid with ${game.round.challenge}`);
            const headerDisplayText = document.getElementById("headerDisplayText")
            headerDisplayText.textContent = `${player.name} raised challenge to: ${raiseChallengeSelect.value}`;

            if (game.round.challenge < game.round.totalDiscsPlayed) {


                loadPlayerControls(game.round.incrementTurn()); // Next Player
            } else {
                game.round.phase = phases.executingChallenge; // No more players take turns, now we enter the flipping over cards to win phase.
                loadPlayerControls(game.round.currentPlayerTurnId); // Move to next player without incrementing turn, the same player will start their turn. 
            }
        })

        // Alternatively, the player can pass:
        // Create a button to pass: 
        const passButton = document.createElement("button");
        passButton.textContent = "Pass";
        playerDisplaySection.appendChild(passButton);

        passButton.addEventListener("click", (event) => {
            // If they pass:
            player.pass = true;
            game.round.numPlayersNotPassed--;
            // const playerName = document.querySelector(`#p${player.id} .table-display-player-name`);
            // playerName.textContent = `${player.name} (passed)`;
            refreshGameDisplay();
            if (game.round.numPlayersNotPassed > 1) {
                loadPlayerControls(game.round.incrementTurn());
            } else {
                game.round.phase = phases.executingChallenge;


                game.round.currentPlayerTurnId = game.round.challengePlayer.id;
                loadPlayerControls(game.round.currentPlayerTurnId);

            }
        })

    }


    if (game.round.phase === phases.executingChallenge) {

        const headerDisplayText = document.getElementById("headerDisplayText");
        headerDisplayText.textContent = `${player.name} is now executing the challenge, he/she must flip over ${game.round.challenge} flower cards!`;

    }



}

function refreshGameDisplay() {
    // Delete the current contents of the game display and reset: 
    deleteGameDisplay();

    // Put each player's mat contents on to the middle display area. 
    // [Player Name] [Player Mat] [text box of cards in hand]
    // But only if that player has discs left in their hand.

    for (let i = 0; i < game.round.numPlayers; i++) {
        let displayPlayer = game.round.players[i];

        if (displayPlayer.hand) {
            // If hand is not empty:
            placePlayerIntoGameDisplay(game.round.players[i]);
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

function deleteHeader() {
    let child = header.lastElementChild;
    while (child) {
        header.removeChild(child);
        child = header.lastElementChild;
    }
}

function placePlayerIntoGameDisplay(player) {
    const tableDisplayPlayer = document.createElement("div");
    tableDisplayPlayer.classList.add("table-display-player");
    tableDisplayPlayer.setAttribute("id", `p${player.id}`);
    gameDisplay.appendChild(tableDisplayPlayer);

    const playerName = document.createElement("p");
    playerName.textContent = player.name;
    if (player.pass) {
        playerName.textContent += `(passed)`;
    }
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
        matDisc.setAttribute("value", player.id);
        matDisc.style.left = `${(d * discOverlap * discSize)}px`;

        // Put event listeners on these discs but they'll do nothing until the final stage: 

        matDisc.addEventListener("click", (event) => {

            // Must be in the executing challenge phase AND it must be a skull that hasn't been clicked, and it mustbe on the top.
            const headerDisplayText = document.getElementById("headerDisplayText");

            if ((game.round.phase === phases.executingChallenge)
                && ((matDisc.nextElementSibling === null) || (matDisc.nextElementSibling.classList.contains("revealed")))
                && !matDisc.classList.contains("revealed")) {


                // When you click it, add a "revealed" class to it and that will apply the appropriate styling
                let clickingPlayer = game.round.challengePlayer;

                // Now check to make sure that you've already flipped all your own discs.
                if ((clickingPlayer.id !== Number(matDisc.value)) &&
                    (clickingPlayer.numOwnDiscsRevealed < clickingPlayer.mat.length)) {
                    headerDisplayText.textContent = "Oops, you have to flip all your own first!!";
                    return; // exit function
                } else if (clickingPlayer.id === Number(matDisc.value)) {
                    clickingPlayer.numOwnDiscsRevealed++;
                }


                matDisc.classList.add("revealed");

                // If you picked a skull: You discard one of you discs, then restart the round. If you discarded your last disc, you are removed from the game and restart the round.
                if (matDisc.classList.contains(SKULL)) {
                    game.round.skullRevealed = true;
                    headerDisplayText.textContent = `${clickingPlayer.name} revealed a skull, they lose a disc!`;
                    clickingPlayer.discardRandomDisc();
                    // CHECK does he/she have discs
                    if (!clickingPlayer.allDiscs.length) {
                        // Player ran out of discs. Remove this player from the "players" list
                        clickingPlayer.ejected = true;
                        game.round.players.splice(clickingPlayer.id, 1);
                    }
                    resetForNewRound();

                } else if (matDisc.classList.contains(FLOWER)) {

                    game.round.numFlowersRevealed++;
                    if (game.round.numFlowersRevealed < game.round.challenge) {
                        headerDisplayText.textContent = `${clickingPlayer.name} revealed a flower! So far revealed ${game.round.numFlowersRevealed}/${game.round.challenge} flowers`;

                    } else {

                        if (clickingPlayer.matFlipped) {
                            headerDisplayText.textContent = `${clickingPlayer.name} wins the game! Revealed ${game.round.numFlowersRevealed}/${game.round.challenge} flowers! and Flips their mat the second time! Select new number of players!`;
                            resetChooseNumPlayers();
                        } else {
                            headerDisplayText.textContent = `${clickingPlayer.name} wins this round! Revealed ${game.round.numFlowersRevealed}/${game.round.challenge} flowers! Flips his/her mat for the first time!`;
                            clickingPlayer.matFlipped = 1;
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
    playerHand.textContent = `Hand: ${player.getStringOfHand()}, mat flipped? ${player.matFlipped}, ${player.allDiscs.length} discs left`;
    playerHand.classList.add("table-display-player-hand")
    tableDisplayPlayer.appendChild(playerHand);


}

