function Labyrinth() {
    this.width = 40;
    this.height = 70;

    this.blockWidth = Global.blockWidth;
    this.emptyRadius = Global.emptyRadius;

    this.initView();

    window.labyrinth = this;
};

Labyrinth.prototype.setConfig = function (config) {

    this.config = config.conf;
    this.leftTeam = config.leftTeam;
    this.rightTeam = config.rightTeam;
    this.flagPos = config.flag;

    this.container.removeChildren();
    this.initView();
};

Labyrinth.prototype.init = function (config) {
    this.config = config;

    if (!config) {
        this.generate();
    }

    this.initView();
};

Labyrinth.prototype.generate = function () {
    var columns = [];

    for (var i = 0; i < this.height; i++) {
        columns.push(this.getRandomLine());
    }

    this.config = columns;

    this.wrapInWalls();

};

Labyrinth.prototype.initView = function () {
    var me = this,
        container = this.container || new PIXI.Container();

    container.depth = 3;

    if (this.config) {
        this.config.forEach(function (line, lineNum) {
            line.forEach(function (block, blockNum) {
                block = me.createBlock(block);
                block.position = new PIXI.Point(lineNum * me.blockWidth, blockNum * me.blockWidth);
                container.addChild(block);
            });
        });

        if(this.flagPos){
            this.flag = new Flag(this.flagPos);
        }
    }

    this.container = container;

    renderer.addToRenderLoop(container);
};

Labyrinth.prototype.wrapInWalls = function () {

    //exit
    var backWall = this.getWallLine(this.width);
    this.config.push(backWall.line);
    this.exit = backWall.door + 1;

    //entry
    var entryWall = this.getWallLine(this.width);
    this.config.unshift(entryWall.line);
    this.entry = entryWall.door + 1;

    //side borders
    this.config.forEach(function (line) {
        line.push(1);
        line.unshift(1);
    });
};

Labyrinth.prototype.getWallLine = function (length) {
    var result = [],
        randomDoorNum = 1 + Math.floor(Math.random() * length - 1);

    while (result.length < length) {
        // if (result.length === randomDoorNum) {
        //     result.push(0);
        // } else {
        result.push(1);
        // }
    }

    return {line: result, door: randomDoorNum};
};

Labyrinth.prototype.createBlock = function (full) {
    var gfx = new PIXI.Graphics(),
        width = this.blockWidth;

    gfx.beginFill(0x616161, 1);
    if (full) {
        gfx.drawRect(0, 0, width, width);
    } else {
        gfx.drawCircle(width / 2, width / 2, this.emptyRadius);
    }

    gfx.endFill();

    return gfx;
};

Labyrinth.prototype.getRandomLine = function () {
    var line = [];

    for (var i = 0; i < this.width; i++) {
        line.push(Math.round(Math.random() - 0.3));
    }

    return line;
};

ModuleLoader.register(Labyrinth, "labyrinth");