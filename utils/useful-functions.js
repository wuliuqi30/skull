import {Position} from "../js-classes/position.js";

function getPlayerMatPositions(n, matHeight, matWidth, tableHeight, tableWidth, radiusy, radiusx) {
    // given n players, return their respective relative x,y locations on an imaginary elliptical table of radius ry,rx in a box of height height and width

    // The first player is always at the bottom of the circle:
    // down = top = x, to the right = left = y
    const origin = new Position(tableHeight / 2, tableWidth / 2  )

    let angleDivision = 360 / n; 
    let anglesRad;
    let relPosition;
    let positions = [];

    for (let i = 0; i < n; i ++){
        anglesRad = (i * angleDivision) * Math.PI / 180;
        relPosition = new Position(radiusy * Math.cos(anglesRad)- matHeight / 2, radiusx * Math.sin(anglesRad)- matWidth / 2 );
        positions[i] = Position.addVectors(origin, relPosition)
    }


    return positions;

}

export {getPlayerMatPositions};