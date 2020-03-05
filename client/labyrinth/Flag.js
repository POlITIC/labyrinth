function Flag(pos) {
    this.initView();
    this.setPosition(pos[0], pos[1]);
}

Flag.prototype.initView = function () {
    var container = new PIXI.Container(),
        item;

    container.depth = 10;
    item = this.createItem();
    container.addChild(item);

    renderer.addToRenderLoop(container);

    this.item = item;
};

Flag.prototype.createItem = function () {
    var item = new PIXI.Graphics();

    item.lineStyle(1, 0xff0000, 1);
    item.moveTo(Global.blockWidth/2, Global.blockHeight);
    item.lineTo(Global.blockWidth/2, 0);
    item.lineTo(Global.blockWidth, Global.blockHeight / 4);
    item.lineTo(Global.blockWidth/2, Global.blockHeight / 2);
    item.endFill();

    return item;
};

Flag.prototype.setPosition = function (left, top) {
    this.item.position = new PIXI.Point(left * Global.blockWidth, top * Global.blockHeight);
};

Flag.prototype.update = function (conf) {
    this.setPosition(conf.left, conf.top);
};
