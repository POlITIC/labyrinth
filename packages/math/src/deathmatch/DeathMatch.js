const Labyrinth = require("../Labyrinth");
const Bot = require("../Bot");
const {ORIENTATIONS, ACTIONS} = require("../Constants");

module.exports = class DeathMatch {
    constructor(labyrinthConfig, botConfigs) {
        this.labyrinth = new Labyrinth(labyrinthConfig);

        this.createBots(botConfigs);
    }

    createBots(botConfigs) {
        this.bots = botConfigs.map((conf) => new Bot(conf, this.labyrinth));
    }

    makeBotMoves() {
        const moveConfigs = this.calculateBotConfigs();

        this.bots.forEach((bot, index) => {
            // TODO try-catch this maybe
            bot.makeAMove(moveConfigs[index]);
            // result of the config should be 2 actions in an order in an array
        });
    }

    calculateBotConfigs() {
        return this.bots.map(bot => {
            const position = bot.position;
            const surround = this.labyrinth.getPositionSurround(position); // TODO ARRAY????
            const orientation = bot.orientation;
            const enemyInView = this.getEnemyInView(bot);

            bot.victim = enemyInView;

            return {
                position,
                surround,
                orientation,
                enemyInView
            };
        });
    }

    getNextCellInView({left, top}, orient) {
        switch (orient) {
            case ORIENTATIONS.LEFT:
                return {left: left - 1, top};
            case ORIENTATIONS.RIGHT:
                return {left: left + 1, top};
            case ORIENTATIONS.UP:
                return {left, top: top - 1};
            case ORIENTATIONS.DOWN:
                return {left, top: top + 1};
        }
    }

    getBotInPosition({left, top}) {
        return this.bots.filter(({
                                     position,
                                     isDead
                                 }) => position.left === left && position.top === top && !isDead)[0];
    }

    getEnemyInView(bot) {
        let isWall = false;
        let pos = bot.position;
        let victim = false;

        // find a wall in view.
        while (!isWall) {
            pos = this.getNextCellInView(pos, bot.orientation);
            victim = this.getBotInPosition(pos);
            isWall = this.labyrinth.getWall(pos);
        }

        return victim;
    }

    processMoves() {
        // first action

        // process fire actions
        this.eachLiveBot.forEach(bot => {
            const {currentMove} = bot;
            const firstAction = currentMove[0];

            if (firstAction) {
                if (firstAction === ACTIONS.FIRE && bot.victim) {
                    bot.victim.isFiredUpon = true;
                }
            }
        });

        // process other actions
        this.eachLiveBot.forEach(bot => {
            const {currentMove} = bot;
            const firstAction = currentMove[0];

            if (firstAction) {
                bot.performAction(firstAction);
            }
        });

        // conclude actions
        this.eachLiveBot.forEach(bot => {
            if (bot.isFiredOrientation) {
                bot.isDead = true;
            }
        });

        //second action

        // process fire actions
        this.eachLiveBot.forEach(bot => {
            const {currentMove} = bot;
            const secondAction = currentMove[0];

            if (secondAction) {
                if (secondAction === ACTIONS.FIRE && bot.victim) {
                    bot.victim.isFiredOrientation = bot.orientation;
                }
            }
        });

        // process other actions
        this.eachLiveBot.forEach(bot => {
            const {currentMove} = bot;
            const secondAction = currentMove[1];

            if (secondAction) {
                bot.performAction(secondAction);
            }
        });

        // conclude actions
        this.eachLiveBot.forEach(bot => {
            if (bot.isFiredOrientation) {
                bot.isDead = true;
            }
        });
    }

    get eachLiveBot() {
        return this.bots.filter(bot => !bot.isDead);
    }

    tick() {
        this.bots.forEach(bot => bot.moveCleanup());

        this.makeBotMoves();

        console.log(this.bots.map(bot => `${bot.id}[${bot.currentMove.join(",")}]`));

        this.processMoves();

        return this.bots.map(bot => bot.getStats());
    }

    getBots () {
        return this.bots;
    }
}
