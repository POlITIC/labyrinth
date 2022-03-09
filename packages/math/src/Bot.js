import {ACTIONS, ORIENTATIONS} from "./Constants";

export default class Bot {

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
	 * @param {string} config.id
	 * @param {string} config.code
	 */
	constructor(config) {
		this.id = config.id;
		this.position = {left: 2, top: 2};
		this.orientation = ORIENTATIONS.RIGHT;
		this.isDead = false;
		this.currentMove = null;

		this.createBotCode(config.code);
	}


	/**
	 *
	 * @param {string} code
	 */
	createBotCode(code) {
		console.warn("createBotCode should be run only on client side", code);
		// TODO this should be substituted with custom interpreter with security.
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
		if(Array.isArray(move)){
			// accounts only 2 first moves
			// TODO should notify user that move is not or not fully compliant
			move = move.slice(0, 1);
		}else if(typeof move === "string"){
			// wraps into array if single string
			move = [move];
		} else {
			return [];
		}

		const posActions = [ACTIONS.MOVE_LEFT, ACTIONS.MOVE_RIGHT, ACTIONS.MOVE_BOTTOM, ACTIONS.MOVE_TOP];
		let amountOfPosActions = 0;
		move.forEach(mv => {
			if(posActions.includes(mv)){
				amountOfPosActions++;
			}
		});

		if(amountOfPosActions >= 2){
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
		const move = this.moveCallback(config);
	}

}
