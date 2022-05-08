const Labyrinth = require("../Labyrinth");
const Bot = require("../Bot");
const {ORIENTATIONS, ACTIONS} = require("../Constants");
const {calculateMinDistance} = require("../utils");

const additions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];

module.exports = class DeathMatch {
    constructor(labyrinthConfig, botConfigs) {
        this.labyrinth = new Labyrinth(labyrinthConfig);

        this.createBots(botConfigs);
    }

    createBots(botConfigs) {
        // TODO improve this

        // one side of a quadrant size
        const minDistance = Math.floor(this.labyrinth.width / (botConfigs.length + 1));

        this.bots = [];

        botConfigs.forEach((conf, index) => {
            let posFound = false;
            let pos = {};

            while (!posFound) {
                pos = {
                    left: Math.floor(Math.random() * this.labyrinth.width),
                    top: Math.floor(Math.random() * this.labyrinth.height)
                };

                if (
                    index !== 0
                    && calculateMinDistance(
                        this.bots.slice(0, index).map(bot => bot.position)
                        , pos) < minDistance
                ) {
                    continue;
                }

                let i = 0;
                while (!posFound && additions[i]) {
                    pos.left += additions[i][0];
                    pos.top += additions[i][1];
                    posFound = true;
                    i++;
                    //TODO refactor this
                    if (this.labyrinth.getWall(pos)) {
                        posFound = false;
                    }
                }

            }

            // console.log(`Bot ${conf.botName}'s position is ${pos.left} ${pos.top} and there is wall: ${Boolean(this.labyrinth.getWall(pos))}`);

            this.bots.push(new Bot({...conf, pos}, this.labyrinth));
        });

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
        // TODO concept of saved data
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
                enemyInView: Boolean(enemyInView)
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
        return this.bots.filter(({position, isDead}) =>
            position.left === left && position.top === top && !isDead)[0];
    }

    getEnemyInView(bot) {
        let isWall = false;
        let pos = bot.position;
        let victim = null;

        // find a wall in view.
        while (!isWall && !victim) {
            pos = this.getNextCellInView(pos, bot.orientation);
            victim = this.getBotInPosition(pos);
            isWall = this.labyrinth.getWall(pos);
        }

        return victim;
    }

    checkForDamage() {
        // conclude actions
        this.eachLiveBot.forEach(bot => {
            if (bot.assailant) {
                bot.hp -= bot.assailant.dmg;
            }

            if (bot.hp <= 0) {
                bot.isDead = true;
            }
        });
    }

    processFireActions(actionIndex) {
        this.eachLiveBot.forEach(bot => {
            const {currentMove} = bot;
            const action = currentMove[actionIndex];

            if (action) {
                if (action === ACTIONS.FIRE && bot.victim) {
                    bot.victim.isFiredOrientation = bot.orientation;
                    bot.victim.assailant = bot;
                }
            }
        });
    }

    processOtherActions(actionIndex) {
        this.eachLiveBot.forEach(bot => {
            const {currentMove} = bot;
            const action = currentMove[actionIndex];

            if (action) {
                bot.performAction(action);
            }
        });
    }

    processActions(actionIndex) {
        // process fire actions
        this.processFireActions(actionIndex);

        // process other actions
        this.processOtherActions(actionIndex);

        // conclude actions
        this.checkForDamage();
    }

    processMoves() {
        // first action
        this.processActions(0);

        //second action
        this.processActions(1);
    }

    get eachLiveBot() {
        return this.bots.filter(bot => !bot.isDead);
    }

    tick() {
        this.bots.forEach(bot => bot.moveCleanup());

        this.makeBotMoves();

        this.processMoves();

        return this.bots.map(bot => bot.getStats());
    }

    getBots() {
        return this.bots;
    }
}
