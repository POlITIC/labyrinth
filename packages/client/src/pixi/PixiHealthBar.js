import * as PIXI from "pixi.js";
import {calculateColorByHp} from "./utils";

export class PixiHealthBar extends PIXI.Container {
    /**
     *
     * @param conf
     * @param conf.width
     * @param conf.height
     * @param conf.hp
     * @param conf.maxHp
     */
    constructor(conf) {
        super();

        this.conf = conf;
        this.createBar();
    }

    createBar() {
        this.gfx = new PIXI.Graphics();

        this.addChild(this.gfx);
    }

    update(hp, maxHp) {
        this.conf.hp = hp;
        this.conf.maxHp = maxHp;

        this.draw();
    }

    draw() {
        const gfx = this.gfx;
        const {width, height, hp, maxHp} = this.conf;
        const color = calculateColorByHp(hp, maxHp);
        const barWidth = (hp / maxHp) * width;

        gfx.clear();

        gfx.lineStyle(height, parseInt(color, 16));
        gfx.moveTo(0, 0);
        gfx.lineTo(barWidth, 0);
    }
}
