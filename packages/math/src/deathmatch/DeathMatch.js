const Labyrinth = require("../Labyrinth");
const Bot = require("../Bot");
const {ORIENTATIONS} =  require("../Constants");

module.exports = class DeathMatch {
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
			// TODO try-catch this maybe?
			// TODO use node vm to isolate untrusted code.
			bot.makeAMove(moveConfigs[index]);
			// result of the config should be 2 actions in an order in an array
		});
	}

	calculateBotConfigs () {
		return this.bots.map(bot => {
			const position = bot.position;
			const surround = this.labyrinth.getPositionSurround(position); // TODO ARRAY????
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
			return this.bots.some(({position}) => position.left === left && position.top === top && !bot.isDead);
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
		// TODO process result of moves.
	}

	tick () {
		this.makeBotMoves();
		this.processMoves();

		return this.bots.map(bot => bot.getStats());
	}
}
