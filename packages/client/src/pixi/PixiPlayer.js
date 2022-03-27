import * as PIXI from "pixi.js";

export default class PixiPlayer {
	/**
	 *
	 * @param {Object} config
	 * @param {number} config.maxHP
	 * @param {number} config.width
	 * @param {number} config.height
	 * @param {string} config.name
	 * @param {string} config.color
	 */
	constructor(config) {

		this.name = config.name;
		this.maxHP = config.maxHP;
		this.health = config.maxHP;
		this.width = config.width;
		this.height = config.height;

		this.color = config.color;

		this.dead = false;

		this.init();
	}

	init() {
		this.container = new PIXI.Container();
		this.createBody();
		this.createHealthBar();
	}

	createBody () {
		const body = new PIXI.Graphics();

		body.clear();

		body.beginFill(this.color, 1);
		body.lineStyle(1, 0xaa0000);
		// body.drawRect(-this.width/ 2, -this.height / 2, this.width, this.height);
		body.drawRect(0, 0, this.width, this.height);
		body.endFill();

		this.container.addChild(body);
	}

	createHealthBar() {
		const hb = new PIXI.Graphics();

		hb.clear();

		hb.beginFill(0x00f000, 1);
		// hb.drawRect(-this.width/ 2, -this.height / 2, this.width, this.height * 0.1);
		hb.drawRect(0, 0, this.width, this.height * 0.1);
		hb.endFill();

		this.container.addChild(hb);
	}

	moveTo (left, top) {
		this.container.position.set(left * this.width, top * this.height);
	}

	createNameLabel () {


	}

	setHealth () {

	}

	die () {
		this.container.tint = 0x000000;
		this.dead = true
	}

	destroy() {
		this.container.destroy({children: true});
	}
}
