import {DIRECTIONS} from "../constants";
import * as PIXI from "pixi.js";

const getRandomInt = (max = 255) => Math.floor((max + 1) * Math.random());

/**
 *
 * @param {string} r
 * @param {string} g
 * @param {string} b
 * @return {string}
 */
const rgbToColor = (r, g, b) => {
    let array = [r, g, b];

    array = array.map((color) => {
        if(color.length === 1){
            return "0"+color;
        }
        return color;
    });

    return array.join("");
};

export const createRandomColor = () => {
    const r = getRandomInt().toString(16);
    const g = getRandomInt().toString(16);
    const b = getRandomInt().toString(16);

    return rgbToColor(r, g, b);
};

export const calculateColorByHp = (hp, maxHp) => {
    const percent = hp / maxHp;
    const b = 0;
    const r = percent > 0.5
        ? 255 - (255 * ((percent - 0.5) / 0.5))
        : 255;
    const g = percent < 0.5
        ? 255 * (percent / 0.5)
        : 255;

    return rgbToColor(
        Math.floor(r).toString(16),
        Math.floor(g).toString(16),
        Math.floor(b).toString(16)
    );
}

window.testHP = (hp, mhp) => {
    console.log(calculateColorByHp(hp, mhp));
    console.log(`%c ${hp}/${mhp}`, `background: #${calculateColorByHp(hp, mhp)}`);
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
