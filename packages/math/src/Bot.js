import {ORIENTATIONS} from "./Constants";

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
		this.dead = false;
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

	/**
	 *
	 * @param {MoveConfig} config
	 * @return {Array}
	 */
	makeAMove(config) {
		return this.currentMove = this.moveCallback(config);
	}

}
