import * as PIXI from "pixi.js";
import PixiLabyrinth from "./PixiLabyrinth";
import PixiPlayer from "./PixiPlayer";
import {getSocket} from "../socket/socket";
import {createRandomColor} from "./utils";

const DEFAULT_PARAMS = {
    width: 300,
    height: 400
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
            console.log("%c" + stats.map(s => {
                return `${s.i}:${JSON.stringify(s.p)}:${s.o}:${s.d}`;
            }).join("\n"), `background: #${stats.some(s=>s.d)?"ffffff":"111111"}`);

            this.updateBots(stats);
        });
    }

    /**
     *
     * @param {Array<object>} configs
     */
    createBots(configs) {
        configs.forEach((botConfig) => {
            console.error("BOT CONF", botConfig);
            const color = createRandomColor();
            const bot = new PixiPlayer({
                color,
                name: botConfig.id,
                direction: botConfig.orientation,
                maxHP: 100,
                ...this.labyrinth.calculateWalSize()
            });

            const {left, top} = botConfig.position;

            bot.moveTo(left, top);
            this.app.stage.addChild(bot.container);

            this.players[botConfig.id] = bot;
        });

        console.error("BOTS CREATED");
    }

    updateBots(configs) {
        if (!this.started) {
            return;
        }

        configs.forEach(botConfig => {
            const bot = this.players[botConfig.i];

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

    startMatch(labyrinthConfig, botConfigs) {
        this.clearField();
        this.showLabyrinth(labyrinthConfig)
        this.createBots(botConfigs);
        this.started = true;
    }

    stopMatch() {
        this.started = false;
    }
}

export default new PixiApp();
