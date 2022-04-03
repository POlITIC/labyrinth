const {ACTIONS, ORIENTATIONS, INIT_HP, DAMAGE} = require("./Constants");

let ii = 0;

module.exports = class Bot {

    /**
     * @typedef {Object} Position Current position in labyrinth.
     * @property {number} left
     * @property {number} top
     */

    /**
     * @typedef {Object} Surround True if there is a wall.
     * @property {boolean} left
     * @property {boolean} right
     * @property {boolean} back
     * @property {boolean} front
     */

    /**
     * @typedef {Object} MoveConfig
     * @property {Surround} surround
     * @property {boolean} enemyInView
     * @property {Position} position
     * @property {Array} history
     * @property {number} health
     */

    /**
     *
     * @param {object} config
     * @param {string} config.botName
     * @param {string} config.code
     * @param {object} labyrinth Labyrinth reference
     */
    constructor(config, labyrinth) {
        this.id = config.botName;
        this.position = {
            left: ii % 2 > 0.5 ? 1 : 3,
            top: 2
        };

        // TODO remove this shit
        ii++;

        this.orientation = ORIENTATIONS.RIGHT;
        this.isDead = false;
        this.labyrinth = labyrinth;

        this.maxHp = this.hp = INIT_HP;
        this.dmg = DAMAGE;

        // to clean up
        this.currentMove = null;
        this.isFiredOrientation = null;
        this.assailant = null;

        this.createBotCode(config.code);
    }


    /**
     *
     * @param {string} code
     */
    createBotCode(code) {
        // TODO use node vm to isolate untrusted code.
        this.moveCallback = Function(code);
    }


    /**
     *
     * @param {Position} position
     */
    init(position) {
        this.position = position;
    }

    filterMove(move) {
        if (Array.isArray(move)) {
            // accounts only 2 first moves
            // TODO should notify user that move is not or not fully compliant
            move = move.slice(0, 1);
        } else if (typeof move === "string") {
            // wraps into array if single string
            move = [move];
        } else {
            return [];
        }

        const posActions = [ACTIONS.MOVE_LEFT, ACTIONS.MOVE_RIGHT, ACTIONS.MOVE_DOWN, ACTIONS.MOVE_UP];
        let amountOfPosActions = 0;
        move.forEach(mv => {
            if (posActions.includes(mv)) {
                amountOfPosActions++;
            }
        });

        if (amountOfPosActions >= 2) {
            // TODO should notify user that move is not or not fully compliant
            move = [move[0]];
        }

        // other filters:  no moves through walls, no moves through people(?)
        //
    }

    /**
     *
     * @param {MoveConfig} config
     * @return {Array}
     */
    makeAMove(config) {
        this.currentMove = this.moveCallback(config);
    }

    /**
     *
     * @param {string} action
     */
    performAction(action) {
        const pos = this.position;
        switch (action) {
            case ACTIONS.MOVE_UP:
                if(!this.labyrinth.getWall({...this.position, top: this.position.top - 1})){
                    pos.top--;
                }
                break;
            case ACTIONS.MOVE_DOWN:
                if(!this.labyrinth.getWall({...this.position, top: this.position.top + 1})){
                    pos.top++;
                }
                break;
            case ACTIONS.MOVE_RIGHT:
                if(!this.labyrinth.getWall({...this.position, left: this.position.left + 1})){
                    pos.left++;
                }
                break;
            case ACTIONS.MOVE_LEFT:
                if(!this.labyrinth.getWall({...this.position, left: this.position.left - 1})){
                    pos.left--;
                }
                break;
            case ACTIONS.LOOK_LEFT:
                this.orientation = ORIENTATIONS.LEFT;
                break;
            case ACTIONS.LOOK_RIGHT:
                this.orientation = ORIENTATIONS.RIGHT;
                break;
            case ACTIONS.LOOK_UP:
                this.orientation = ORIENTATIONS.UP;
                break;
            case ACTIONS.LOOK_DOWN:
                this.orientation = ORIENTATIONS.DOWN;
                break
        }

        if (this.position.left < 0 || this.position.top < 0){
            debugger;
        }
    }

    tryAvoidHit(action) {
        switch (action) {
            case ACTIONS.MOVE_UP:
            case ACTIONS.MOVE_DOWN:
                if (this.isFiredOrientation === ORIENTATIONS.LEFT
                    || this.isFiredOrientation === ORIENTATIONS.RIGHT) {
                    this.isFiredOrientation = null;
                }
                break;
            case ACTIONS.MOVE_RIGHT:
            case ACTIONS.MOVE_LEFT:
                if (this.isFiredOrientation === ORIENTATIONS.UP
                    || this.isFiredOrientation === ORIENTATIONS.DOWN) {
                    this.isFiredOrientation = null;
                }
                break;
        }
    }

    moveCleanup() {
        this.isFiredOrientation = null;
        this.currentMove = null;
        this.assailant = null;
    }


    getStats() {
        return {
            i: this.id,
            p: this.position,
            o: this.orientation,
            d: this.isDead,
            h: this.hp,
            mh: this.maxHp
        }
    }
}
