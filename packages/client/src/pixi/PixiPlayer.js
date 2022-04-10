import * as PIXI from "pixi.js";
import {getDirectionPoints} from "./utils";
import {PixiHealthBar} from "./PixiHealthBar";
import store from "../store/store";
import {deadBot} from "../store/actionCreators/ActionCreator";

export default class PixiPlayer extends PIXI.Container {
    /**
     *
     * @param {Object} config
     * @param {number} config.maxHP
     * @param {number} config.width
     * @param {number} config.height
     * @param {string} config.name
     * @param {string} config.color
     * @param {string} config.direction
     */
    constructor(config) {

        super();

        this.maxHP = config.maxHP;
        this.health = config.maxHP;
        this.playerWidth = config.width;
        this.playerHeight = config.height;

        this.name = config.name;
        this.color = config.color;
        this.direction = config.direction;

        this.dead = false;

        this.init();
    }

    init() {
        this.createBody();
        this.createScopes();
        this.createHealthBar();
    }

    createBody() {
        const body = new PIXI.Graphics();

        body.clear();

        body.beginFill(this.color, 1);
        body.lineStyle(2, 0xaa0000);
        body.drawRect(0, 0, this.playerWidth, this.playerHeight);
        body.endFill();

        this.addChild(body);
    }

    createScopes() {
        const scopes = new PIXI.Graphics();
        this.scopes = scopes;

        this.drawScopes();

        this.addChild(scopes);
    }

    drawScopes() {
        const scopes = this.scopes;

        scopes.clear();

        scopes.beginFill(0xffffff, 0.3);
        scopes.lineStyle(2, 0xaa0000);

        const points = getDirectionPoints(this.playerWidth, this.playerHeight, this.direction);

        points.forEach((point, index) => {
            if (index === 0) {
                scopes.moveTo(point.x, point.y);
            } else {
                scopes.lineTo(point.x, point.y);
            }
        });

        scopes.endFill();
    }

    createHealthBar() {
        const hb = new PixiHealthBar({
            width: this.playerWidth,
            height: this.playerHeight * 0.1,
            hp: this.health,
            maxHp: this.maxHP
        })

        this.healthBar = hb;
        this.addChild(hb);
    }

    /**
     *
     * @param {object} data
     * @param {object} data.p
     * @param {number} data.p.left
     * @param {number} data.p.top
     * @param {string} data.o
     * @param {boolean} data.d
     */
    update(data) {
        if (this.dead) {
            return;
        }

        if (data.d) {
            this.die();
        }
        // position
        const {left, top} = data.p;
        this.moveTo(left, top);

        // direction
        this.direction = data.o;
        this.drawScopes();

        this.setHealth(data);
    }

    moveTo(left, top) {
        this.position.set(left * this.playerWidth, top * this.playerHeight);
    }

    setHealth(data) {
        this.health = data.h;
        this.maxHP = data.mh;
        this.healthBar.update(data.h, data.mh)
    }

    die() {
        this.healthBar.destroy();
        this.alpha = 0.1;
        this.dead = true

        store.dispatch(deadBot(this.name));
    }

    destroy() {
        super.destroy({children: true});
    }
}
