function Renderer() {
    var me = this;

    me.renderId = null;
    me.lastRenderedTime = 0;
    me.mainContainer = undefined;

    me.initPIXI();
    me.initLoop();
}

Renderer.prototype.startRender = function () {
    var me = this;

    me.renderId = requestAnimationFrame(me.run.bind(me));
};

Renderer.prototype.initPIXI = function () {
    var me = this;

    me.renderer = PIXI.autoDetectRenderer(Global.WIDTH, Global.HEIGHT, {backgroundColor: 0xffffff});
    document.body.appendChild(me.renderer.view);

    me.mainContainer = new PIXI.Container();

};

Renderer.prototype.addToRenderLoop = function (container) {
    var me = this;

    if (container.depth === undefined || container.depth === null || isNaN(container.depth)) {
        throw new Error("Container depth is not defined");
    }

    me.mainContainer.addChild(container);

    me.mainContainer.children.sort(function (a, b) {
        return a.depth - b.depth;
    });

};

Renderer.prototype.stopRender = function () {
    cancelAnimationFrame(this.renderId);
};

Renderer.prototype.run = function (time) {
    var me = this,
        deltaTime = time - me.lastRenderedTime;

    me.lastRenderedTime = time;

    me.renderer.render(me.mainContainer);

    requestAnimationFrame(me.run.bind(me));
};

Renderer.prototype.initLoop = function () {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
};