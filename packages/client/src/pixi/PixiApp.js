import * as PIXI from "pixi.js";
import PixiLabyrinth from "./PixiLabyrinth";
import PixiPlayer from "./PixiPlayer";

const DEFAULT_PARAMS = {
	width: 300,
	height: 400
}

class PixiApp {
	constructor() {
		this.init();
	}

	init() {
		this.initPixi();
	}

	initPixi() {
		this.app = new PIXI.Application({
			width: DEFAULT_PARAMS.width,
			height: DEFAULT_PARAMS.height,
			backgroundColor: 0x1099bb,
			resolution: window.devicePixelRatio || 1
		});

		this.view = this.app.view;
	}

	showLabyrinth(config) {
		if(this.labyrinth){
			this.app.stage.removeChild(this.labyrinth.container);
		}

		if(this.player){
			this.app.stage.removeChild(this.player.container);
		}

		this.labyrinth = new PixiLabyrinth(config, {totalWidth: DEFAULT_PARAMS.width, totalHeight: DEFAULT_PARAMS.height});
		this.app.stage.addChild(this.labyrinth.container);
		this.labyrinth.render();

		this.player = new PixiPlayer({
			name: "vasa",
			maxHP: 100,
			...this.labyrinth.calculateWalSize()
		});
		this.app.stage.addChild(this.player.container);
		this.player.moveTo(2, 2);
	}
}

export default new PixiApp();
