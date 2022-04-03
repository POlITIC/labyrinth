import {DIRECTIONS} from "../constants";
import * as PIXI from "pixi.js";

const getRandomInt = (max = 255) => Math.floor((max + 1) * Math.random());

export const createRandomColor = () => {
    const r = getRandomInt(15).toString(16);
    const g = getRandomInt().toString(16);
    const b = getRandomInt().toString(16);

    let array = [r, g, b];

    array = array.map((color) => {
        if(color.length === 1){
            return "0"+color;
        }
        return color;
    });

    return array.join("");
};

/**
 *
 * @param width
 * @param height
 * @param dir
 * @return {[PIXI.Point,PIXI.Point,PIXI.Point,PIXI.Point]}
 */
export const getDirectionPoints = (width, height, dir) => {
    const corners = [
        new PIXI.Point(0, 0), // left top
        new PIXI.Point(width, 0), // right top
        new PIXI.Point(width, height), // right bottom
        new PIXI.Point(0, height) // left bottom
    ];

    const mids = [
        new PIXI.Point(width / 2, 0), // top
        new PIXI.Point(width, height / 2), // right
        new PIXI.Point(width / 2, height), // bottom
        new PIXI.Point(0, height / 2) // left
    ];

    switch (dir) {
        case DIRECTIONS.DOWN:
            return [mids[2], corners[0], corners[1], mids[2]];
        case DIRECTIONS.UP:
            return [mids[0], corners[3], corners[2], mids[0]];
        case DIRECTIONS.LEFT:
            return [mids[3], corners[1], corners[2], mids[3]];
        case DIRECTIONS.RIGHT:
            return [mids[1], corners[0], corners[3], mids[1]];
    }
};
