import * as PIXI from "pixi.js";
import {getDirectionPoints} from "./utils";

export default class PixiPlayer {
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

        this.maxHP = config.maxHP;
        this.health = config.maxHP;
        this.width = config.width;
        this.height = config.height;

        this.name = config.name;
        this.color = config.color;
        this.direction = config.direction;

        this.dead = false;

        this.init();
    }

    init() {
        this.container = new PIXI.Container();
        this.createBody();
        this.createScopes();
        this.createHealthBar();
    }

    createBody() {
        const body = new PIXI.Graphics();

        body.clear();

        body.beginFill(this.color, 1);
        body.lineStyle(1, 0xaa0000);
        body.drawRect(0, 0, this.width, this.height);
        body.endFill();

        this.container.addChild(body);
    }

    createScopes() {
        const scopes = new PIXI.Graphics();
        this.scopes = scopes;

        this.drawScopes();

        this.container.addChild(scopes);
    }

    drawScopes() {
        const scopes = this.scopes;

        scopes.clear();

        scopes.beginFill(0xffffff, 0.3);
        scopes.lineStyle(1, 0xaa0000);

        const points = getDirectionPoints(this.width, this.height, this.direction);

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
        const hb = new PIXI.Graphics();

        hb.clear();

        hb.beginFill(0x00f000, 1);
        // hb.drawRect(-this.width/ 2, -this.height / 2, this.width, this.height * 0.1);
        hb.drawRect(0, 0, this.width, this.height * 0.1);
        hb.endFill();

        this.container.addChild(hb);
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
    }

    moveTo(left, top) {
        this.container.position.set(left * this.width, top * this.height);
    }

    setHealth() {

    }

    die() {
        this.container.tint = 0x000000;
        this.dead = true
    }

    destroy() {
        this.container.destroy({children: true});
    }
}
