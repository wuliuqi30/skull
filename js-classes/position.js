class Position {

    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    set x(val) {
        this.#x = val;
    }

    get y() {
        return this.#y;
    }

    set y(val) {
        this.#y = val;
    }

    static addVectors(pos1, pos2) {
        return new Position(pos1.x + pos2.x, pos1.y + pos2.y);
    }
}

export {Position};