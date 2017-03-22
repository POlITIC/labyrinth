function Clock() {

    // millisecond
    this.timeFrame = 200;


    //debug
    window.clock = this;

}

Clock.prototype.start = function () {
    var me = this;

    me.stop();

    me.clockTimeout = setTimeout(function () {
        me.stop();
        if(serverManager.deathMatch){
            serverManager.getUpdate();
        }else{
            playerManager.makeMove();
        }

        me.start();
    }, me.timeFrame);

};

Clock.prototype.stop = function () {
    var me = this;

    if (me.clockTimeout !== undefined) {
        clearTimeout(me.clockTimeout);
    }
};

ModuleLoader.register(Clock, "clock");

