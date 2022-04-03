const ACTIONS = {
    MOVE_LEFT: "MOVE_LEFT",
    MOVE_RIGHT: "MOVE_RIGHT",
    MOVE_UP: "MOVE_UP",
    MOVE_DOWN: "MOVE_DOWN",

    LOOK_LEFT: "LOOK_LEFT",
    LOOK_RIGHT: "LOOK_RIGHT",
    LOOK_UP: "LOOK_UP",
    LOOK_DOWN: "LOOK_DOWN",

    FIRE: "FIRE"
};

const ORIENTATIONS = {
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    UP: "UP",
    DOWN: "DOWN"
};

const INIT_HP = 100;
const DAMAGE = 10;

module.exports = {
    ACTIONS, ORIENTATIONS, INIT_HP, DAMAGE
}
