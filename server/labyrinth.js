// level
var labyrinthConfigs = require("./labyrinthConfigs/basic");

class Labyrinth {
    constructor(level) {
        this.setLevel(level || 0);
    }

    setLevel(levelNum) {
        this.config = labyrinthConfigs[levelNum];
        this.level = levelNum;
        this.flag = this.config.flag;
        this.flagIsHolded = false;
        // playerManager.changeLevel(levelNum);
    }

    getDistanceToFlag(fromLeft, fromTop) {
        var distance = 0;

        // TODO calculate real distance

        if (distance === 0 && this.flagIsHolded == false) {
            this.grabFlag();
        }

        return distance;
    }

    moveFlag(newPos) {

        if (this.flagIsHolded) {
            this.flag[0] = newPos.left;
            this.flag[1] = newPos.top;
        }

    }

    grabFlag() {
        this.flagIsHolded = true;
    }

    leaveFlag() {
        this.flagIsHolded = false;
    }

    getFreeStart() {
        return this.config.startPositions.pop() || [1, 2];
    }

    getUpdate() {

    }

    getCurrentConfig() {
        return this.config;
    }
}

module.exports = Labyrinth;
