import * as PIXI from "pixi.js";

export default class PixiLabyrinth {
	/**
	 *
	 * @param {Array<Array<number>>} config
	 * @param {Object} [size]
	 * @param {number} size.totalWidth in pixels
	 * @param {number} size.totalHeight in pixels
	 */
	constructor(config, size) {
		this.config = config;

		if (size) {
			this.size = size;
		}

		this.container = new PIXI.Container();

		this.gfx = new PIXI.Graphics();
		this.container.addChild(this.gfx);
		this.gfx.width = size.totalWidth;
		this.gfx.height = size.totalHeight;
	}

	/**
	 * @param {Object} [size]
	 * @param {number} size.totalWidth
	 * @param {number} size.totalHeight
	 */
	setSize(size) {
		this.size = size;
	}

	calculateWalSize() {
		const width = this.size.totalWidth / (this.config[0].length);
		const height = this.size.totalHeight / (this.config.length);

		return {width, height};
	}

	render() {
		if (!this.size) {
			throw new Error("Please set labyrinth size before rendering");
		}

		const wallSize = this.calculateWalSize();

		this.gfx.clear();

		this.gfx.beginFill(0x666666, 1);
		this.config.forEach((row, rowIndex) => {
			row.forEach((isWall, wallIndex) => {

				if (Boolean(isWall)) {
					const x = wallSize.width * wallIndex;
					const y = wallSize.height * rowIndex;
					this.gfx.drawRect(x, y, wallSize.width, wallSize.height);
				}
			});
		});

		this.gfx.endFill();
	}

	destroy(){
		this.container.destroy({children: true});
	}
}
