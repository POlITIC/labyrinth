export default class Labyrinth {
    /**
     * @typedef {Object} LabyrinthConfig
     * @property {Array<Array<number>>} rows
     */

    /**
     * @typedef {Object} position
     * @property {number} top
     * @property {number} left
     */

    /**
     *
     * @param {LabyrinthConfig} labyrinthConfig
     */
    constructor(labyrinthConfig) {
        this.config = labyrinthConfig;

        this.height = this.config.length;
        this.width = this.config.length;

        this.init();
    }

    init() {

    }

    /**
     *
     * @param pos
	 * @param {number} pos.left
	 * @param {number} pos.top
     */
    getPositionSurround(pos) {
        const left = this.config[pos.top][pos.left - 1];
        const top = this.config[pos.top - 1] ? this.config[pos.top - 1][pos.left] : 1;
		const right = this.config[pos.top][pos.left + 1];
		const bottom = this.config[pos.top + 1] ? this.config[pos.top + 1][pos.left] : 1;

		return {left, top, right, bottom}; // TODO ARRAY?????
    }

	/**
	 *
	 * @param pos
	 * @param {number} pos.left
	 * @param {number} pos.top
	 */
	getWall(pos) {
		return this.config[pos.top][pos.left];
	}
}
