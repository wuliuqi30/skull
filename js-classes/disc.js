import {SKULL, FLOWER, phases} from "./constants.js";

function Disc(type, id) {
    // type is skull or flower
    this.type = type;
    this.id = id; // the "id" here will correspond to the DOM element's "value"
    this.faceUp = false;
    if (type === SKULL) {
        this.letter = "S";
    } else {
        this.letter = "F"
    };
}

export {Disc}