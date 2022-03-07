import Labyrinth from "../Labyrinth";
import Bot from "../Bot";
import {ORIENTATIONS} from "../Constants";

export default class DeathMatch {
	constructor(labyrinthConfig, botConfigs) {
		this.labyrinth = new Labyrinth(labyrinthConfig);

		this.createBots(botConfigs);
	}

	createBots(botConfigs) {
		this.bots = botConfigs.map((conf) => new Bot(conf));
	}

	makeBotMoves() {
		const moveConfigs = this.calculateBotConfigs();

		this.bots.forEach((bot, index) => {
			bot.makeAMove(moveConfigs[index]);
			// result of the config should be 2 actions in an order in an array
		});
	}

	calculateBotConfigs () {
		return this.bots.map(bot => {
			const position = bot.position;
			const surround = this.labyrinth.getPositionSurround(position);
			const orientation = bot.orientation;
			const enemyInView = this.getEnemyInView(bot);

			return {
				position,
				surround,
				orientation,
				enemyInView
			};
		});
	}

	getEnemyInView (bot) {
		// find a wall in view.
		const getNextPos = ({left, top}, orient) => {
			switch (orient) {
				case ORIENTATIONS.LEFT: return {left: left - 1, top};
				case ORIENTATIONS.RIGHT: return {left: left + 1, top};
				case ORIENTATIONS.TOP: return {left, top: top - 1};
				case ORIENTATIONS.BOTTOM: return {left, top: top + 1};
			}
		};

		const isBotInPosition = ({left, top}) => {
			return this.bots.some(({position}) => position.left === left && position.top === top);
		};

		let isWall = false;
		let pos = bot.position;
		let result = false;

		while(!isWall){
			pos = getNextPos(pos, bot.orientation);
			result = isBotInPosition(pos);
			isWall = this.labyrinth.getWall(pos);
		}

		return result;
	}

	processMoves () {

	}

	tick () {
		this.makeBotMoves();
		this.processMoves();
	}
}
