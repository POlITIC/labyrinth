function Background() {
    this.init();
};

Background.prototype.init = function () {
    var container = new PIXI.Container();

    container.depth = 0;

    var item = new PIXI.Graphics();

    item.beginFill(0xdef1f9, 1);
    item.drawRect(0, 0, Global.WIDTH, Global.HEIGHT);
    item.endFill();

    container.addChild(item);

    renderer.addToRenderLoop(container);

    this.container = container;
    this.item = item;
};


ModuleLoader.register(Background, "background");