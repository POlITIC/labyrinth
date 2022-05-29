import * as PIXI from "pixi.js";
import PixiLabyrinth from "./PixiLabyrinth";
import PixiPlayer from "./PixiPlayer";
import {getSocket} from "../socket/socket";
import {createRandomColor} from "./utils";
import {setBotColor} from "../store/actionCreators/ActionCreator";
import store from "../store/store";

const DEFAULT_PARAMS = {
    width: 1300,
    height: 1400
}

class PixiApp {
    constructor() {
        this.init();

        this.started = false;
        this.players = {};

        // TODO remove
        window.PAPP = this;
    }

    init() {
        this.initPixi();
    }

    initPixi() {
        this.app = new PIXI.Application({
            width: DEFAULT_PARAMS.width,
            height: DEFAULT_PARAMS.height,
            backgroundColor: 0xbbbbbb,
            resolution: window.devicePixelRatio || 1
        });

        this.view = this.app.view;
    }

    showLabyrinth(config) {
        if (this.labyrinth) {
            this.app.stage.removeChild(this.labyrinth.container);
        }

        if (this.player) {
            this.app.stage.removeChild(this.player.container);
        }

        this.labyrinth = new PixiLabyrinth(config, {
            totalWidth: DEFAULT_PARAMS.width,
            totalHeight: DEFAULT_PARAMS.height
        });
        this.app.stage.addChild(this.labyrinth.container);
        this.labyrinth.render();
    }

    subscribeSocket() {
        const socket = getSocket();

        socket.on("gameTick", (stats) => {
            this.updateBots(stats);
        });
    }

    /**
     *
     * @param {Array<object>} configs
     */
    createBots(configs) {
        configs.forEach((botConfig) => {
            const color = createRandomColor();

            store.dispatch(setBotColor(botConfig.id, color));

            const bot = new PixiPlayer({
                color: parseInt(color, 16),
                name: botConfig.id,
                direction: botConfig.orientation,
                maxHP: 100,
                ...this.labyrinth.calculateWalSize()
            });

            const {left, top} = botConfig.position;

            bot.moveTo(left, top);
            this.app.stage.addChild(bot);

            this.players[botConfig.id] = bot;
        });
    }

    updateBots(configs) {
        if (!this.started) {
            return;
        }

        configs.forEach(botConfig => {
            const bot = this.players[botConfig.i];

            //TODO here is where we could refactor and update bots in some centralized way

            bot.update(botConfig);
        });
    }

    clearField() {
        const playersArray = Object.values(this.players)

        if (playersArray.length > 0) {
            playersArray.forEach(bot => bot.destroy());
            this.players = {};
        }

        if (this.labyrinth) {
            this.labyrinth.destroy();
        }
    }

    startMatch(botConfigs) {
        this.createBots(botConfigs);
        this.started = true;
    }

    stopMatch() {
        this.clearField();
        this.started = false;
    }
}

export default new PixiApp();
