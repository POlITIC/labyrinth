var G = require("../Global"),
    labyrinth = require("../labyrinth");

function Player(conf) {
    this.init(conf);
    this.savedData = {};
    this.dirtyPos = 0;
};

Player.prototype.init = function (conf) {
    var me = this,
        posArr = labyrinth.getFreeStart();

    me.moveCallback = conf.cb;
    me.currentPosition = {left: posArr[0], top: posArr[1]};
    me.direction = G.DIRECTIONS.LEFT;
    me.id = conf.name;

};

Player.prototype.makeMove = function (data) {
    var action;

    if (this.moveCallback) {
        action = this.moveCallback.call({}, data, this.savedData);
    }

    return action;
};

Player.prototype.hit = function () {
    this.dead = true;
};

Player.prototype.getSurrounding = function () {
    var current = this.currentPosition,
        lines = labyrinth.getCurrentConfig(),
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
            this.direction = G.DIRECTIONS.LEFT;
            break;
        case "direction_right":
            this.direction = G.DIRECTIONS.RIGHT;
            break;
        case "direction_up":
            this.direction = G.DIRECTIONS.UP;
            break;
        case "direction_down":
            this.direction = G.DIRECTIONS.DOWN;
            break
    }

    this.checkPositionChange();

};

module.exports = Player;


