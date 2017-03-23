function Player(initLeft, initTop, initDir) {

    if (initLeft !== undefined && initTop !== undefined) {
        this.entryPoint = {left: initLeft, top: initTop};
    }

    this.direction = initDir || Global.DIRECTIONS.LEFT;

    this.init();
    this.setInitPosition();
    this.savedData = {};

};

Player.prototype.setColor = function (color) {
    this.color = this.rgbToHex(color);

    this.redrawItem();
    this.addArrow(this.item);
};

Player.prototype.rgbToHex = function (rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    return (rgb && rgb.length === 4) ? "0x" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
};

Player.prototype.init = function () {
    var container = new PIXI.Container(),
        trailContainer = new PIXI.Container();

    container.depth = 5;

    trailContainer.depth = 4;

    var item = this.createItem(1);
    this.addArrow(item);

    // item.lineStyle(1, 0xff0000, 1);
    //
    // item.drawRect(0, 0, item.width, item.height);

    container.addChild(item);

    this.container = container;
    this.trailContainer = trailContainer;
    this.item = item;

    this.entryPoint = this.entryPoint || {left: 0, top: labyrinth.entry};


    this.exitPoint = {
        left: labyrinth.width - 1,
        top: labyrinth.exit
    };

    renderer.addToRenderLoop(container);
    renderer.addToRenderLoop(trailContainer);

};

Player.prototype.setInitPosition = function () {
    // var firstLine = labyrinth.config[0],
    //     entryPoint = -1;
    // firstLine.forEach(function (block, index) {
    //     if (block === 0 && entryPoint < 0) {
    //         entryPoint = index;
    //     }
    // });
    //
    // if (entryPoint >= 0) {
    //     this.item.position = new PIXI.Point(0, entryPoint * Global.blockWidth);
    // } else {
    //     console.error("ENTRY POINT NOT FOUND");
    // }

    this.currentPosition = this.entryPoint;
    this.redraw();
};

Player.prototype.redrawItem = function (_item, alpha, _color) {
    var gfx = _item || this.item,
        color = _color || this.color || Global.playerColor;

    gfx.beginFill(color, alpha);
    gfx.drawRect(0, 0, Global.blockWidth, Global.blockWidth);
    gfx.endFill();

};

Player.prototype.createItem = function (alpha, _color) {
    var gfx = new PIXI.Graphics();

    this.redrawItem(gfx, alpha, _color);

    return gfx;
};

Player.prototype.addArrow = function (gfx) {
    var me = this;

    switch (me.direction){
        case Global.DIRECTIONS.LEFT:
            gfx.beginFill(0xff0000,1);
            gfx.drawPolygon([Global.blockWidth/2, 0, /**/0, Global.blockHeight/2, /**/Global.blockWidth/2, Global.blockHeight]);
            gfx.endFill();
            break;
        case Global.DIRECTIONS.RIGHT:
            gfx.beginFill(0xff0000,1);
            gfx.drawPolygon([Global.blockWidth/2, 0, /**/Global.blockWidth, Global.blockHeight/2, /**/Global.blockWidth/2, Global.blockHeight]);
            gfx.endFill();
            break;
        case Global.DIRECTIONS.UP:
            gfx.beginFill(0xff0000,1);
            gfx.drawPolygon([ 0, Global.blockHeight/2, /**/ Global.blockWidth/2, 0,/**/Global.blockWidth, Global.blockHeight/2]);
            gfx.endFill();
            break;
        case Global.DIRECTIONS.DOWN:
            gfx.beginFill(0xff0000,1);
            gfx.drawPolygon([ 0, Global.blockHeight/2, /**/ Global.blockWidth/2, Global.blockHeight,/**/Global.blockWidth, Global.blockHeight/2]);
            gfx.endFill();
            break;
    }
};

Player.prototype.addTrail = function () {
    var gfx = this.createItem(1, 0xaaaaaa),
        pos = this.currentPosition;

    gfx.position = new PIXI.Point(pos.left * Global.blockWidth, pos.top * Global.blockWidth);
    this.trailContainer.addChild(gfx);
};

/**
 * @returns {String}
 */
Player.prototype.makeMove = function (data) {
    var dir = this.direction,
        surrounding = data.surrounding,
        action;

    if(this.moveCallback){
        action = this.moveCallback.call({}, data, this.savedData);
    }

    return action;
};

Player.prototype.getSurrounding = function () {
    var current = this.currentPosition,
        lines = labyrinth.config,
        up = Math.abs(lines[current.left] [current.top - 1]),
        down = Math.abs(lines[current.left] [current.top + 1]),
        right = Math.abs(lines[current.left + 1] ? lines[current.left + 1] [current.top] : 1),
        left = Math.abs(lines[current.left - 1] ? lines[current.left - 1] [current.top] : 1),
        result = [up, right, down, left];

    result.forEach(function (el, index, arr) {
        if (el === undefined) {
            arr[index] = 1;
        }
    });

    // todo check with exit point
    if (!lines[current.left + 1]) {
        console.error("Congrats! YOU ARE OUT!!!!!");
    }

    return result;
};

Player.prototype.redraw = function () {
    var pos = this.currentPosition,
        width = Global.blockWidth;

    this.item.position = new PIXI.Point(pos.left * width, pos.top * width);
    this.redrawItem(this.item);
    this.addArrow(this.item);
};

Player.prototype.hit = function(){
    this.dead = true;
    this.addTrail();
    this.item.visible = false;

    console.error("PLAyER", this.id, "DEAD");
};

Player.prototype.positionChanged = function(){
    this.dirtyPos = 0;
};

Player.prototype.checkPositionChange = function(){
    if(this.dirtyPos > 15){
        this.hit();
    }else{
        this.dirtyPos++;
    }
};

Player.prototype.performAction = function (action) {
    var pos = this.currentPosition;

    switch (action) {
        case "up":
            pos.top--;
            this.positionChanged();
            break;
        case "down":
            pos.top++;
            this.positionChanged();
            break;
        case "right":
            pos.left++;
            this.positionChanged();
            break;
        case "left":
            pos.left--;
            this.positionChanged();
            break;
        case "direction_left":
            this.direction = Global.DIRECTIONS.LEFT;
            break;
        case "direction_right":
            this.direction = Global.DIRECTIONS.RIGHT;
            break;
        case "direction_up":
            this.direction = Global.DIRECTIONS.UP;
            break;
        case "direction_down":
            this.direction = Global.DIRECTIONS.DOWN;
            break
    }

    this.redraw();

};

Player.prototype.update = function (obj) {
    this.currentPosition = obj.pos;
    this.direction = obj.dir;
    if(obj.dead && !this.dead){
        this.hit();
    }

    this.redraw();
};
