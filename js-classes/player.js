import {SKULL, FLOWER, phases} from "./constants.js";
import { Disc } from "./disc.js";

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

export {Player};