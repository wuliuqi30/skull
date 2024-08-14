
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

export {Round}