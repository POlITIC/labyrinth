function PlayerManager() {

    this.players = [];

    this.playersInfo = {};

    this.actionTypes = {
        move: ["left", "right", "up", "down"],
        assault: ["fire"],
        rotate: ["direction_left", "direction_right", "direction_up", "direction_down"]
    };
};

PlayerManager.prototype.generateColor = function () {
    var me = this,
        grn = me.getRandomNumber.bind(me);

    return "rgba(" + grn(0) + "," + grn(255) + "," + grn(255) + ",1)";
};

PlayerManager.prototype.getRandomNumber = function (maxNum) {
    return Math.floor(Math.random() * maxNum);
};

PlayerManager.prototype.addPlayer = function (player, id) {
    var me = this,
        color = me.generateColor(),
        colors = Object.values(me.playersInfo).map(function (el) {
            return el.color
        });

    while (colors.indexOf(color) > -1) {
        color = me.generateColor();
    }

    player.setColor(color);
    player.id = id;

    this.playersInfo[id] = {
        player: player,
        color: color
    };

    this.players.push(player);

};

PlayerManager.prototype.addPlayerCallback = function (cb, name) {
    var playerInfo = this.playersInfo[name],
        player;

    if (!playerInfo) {
        player = new Player(1, 2);
        this.addPlayer(player, name);
    } else {
        player = playerInfo.player;
    }

    player.moveCallback = cb;

};


PlayerManager.prototype.makeMove = function () {
    var me = this,
        actions = [];


    me.players.forEach(function (player) {

        if (player.dead === true) {
            return;
        }

        var data = me.getPlayerData(player),
            victim = data.playerInSight,
            action;

        var secureData = {
            surrounding: data.surrounding,
            pos: data.pos,
            playerInSight: !(!victim),
            direction: data.direction,
            playersAlive: data.playersAlive
        };

        action = player.makeMove(secureData);

        if (action === "fire" && victim) {
            victim.victim = true;
            victim.aimedDir = (victim.currentPosition.left === player.currentPosition.left) ? "left" : "top";
            victim.prevAimedDir = victim.currentPosition[victim.aimedDir];
        }

        player.currentAction = action;

        actions.push({
            player: player.id,
            moveData: data,
            action: player.currentAction
        });
    });

    me.processActions(actions);

};

PlayerManager.prototype.canDoMove = function (action, surroundings) {
    var actionPos = {
        up: 0,
        right: 1,
        down: 2,
        left: 3
    };

    return surroundings[actionPos[action]] === 0;
};

PlayerManager.prototype.getPlayerData = function (player) {
    var me = this,
        pos = player.currentPosition,
        rotation = player.direction,
        surrounding = player.getSurrounding(),
        playerInSight = me.getInterception(pos, rotation, player),
        playersAlive = me.countAlivePlayers();


    return {
        surrounding: surrounding,
        pos: pos,
        direction: rotation,
        exit: player.exitPoint,
        playerInSight: playerInSight,
        playersAlive: playersAlive
    };
};

/**
 * @returns {Number}
 */
PlayerManager.prototype.countAlivePlayers = function () {
    var result = 0;

    this.players.forEach(function (p) {
        if (!p.dead) {
            result++;
        }
    });

    return result;
};

PlayerManager.prototype.updatePlayers = function (playersObj) {
    for (var name in playersObj) {
        if (playersObj.hasOwnProperty(name)) {
            var p = this.playersInfo[name].player;

            p.update(playersObj[name]);
        }
    }
};

PlayerManager.prototype.getInterception = function (pos, rot, actor) {
    var me = this,
        playerInSight = false,
        wallInBetween = false,
        distance, inc,
        i;

    me.players.forEach(function (player) {
        var ePos = player.currentPosition;

        if (actor.id === player.id || player.dead) {
            return;
        }

        if (!playerInSight && ePos.left === pos.left &&
            (rot === Global.DIRECTIONS.UP || rot === Global.DIRECTIONS.DOWN)) {
            distance = ePos.top - pos.top;
            inc = distance / Math.abs(distance);

            if ((rot === Global.DIRECTIONS.DOWN && distance > 0) || (rot === Global.DIRECTIONS.UP && distance < 0)) {
                // check for walls between
                for (i = pos.top; i < pos.top + distance; i += inc) {
                    if (labyrinth.config[pos.left][i]) {
                        wallInBetween = true;
                    }
                }

                if (!wallInBetween) {
                    playerInSight = player;
                }
            }
        } else {
            if (!playerInSight && ePos.top === pos.top &&
                (rot === Global.DIRECTIONS.LEFT || rot === Global.DIRECTIONS.RIGHT)) {
                distance = ePos.left - pos.left;

                inc = distance / Math.abs(distance);

                if ((rot === Global.DIRECTIONS.RIGHT && distance > 0) || (rot === Global.DIRECTIONS.LEFT && distance < 0)) {
                    // check for walls between
                    for (i = pos.left; i !== pos.left + distance; i += inc) {
                        if (labyrinth.config[i][pos.top]) {
                            wallInBetween = true;
                        }
                    }

                    if (!wallInBetween) {
                        playerInSight = player;
                    }
                }
            }
        }
    });

    return playerInSight;
};

PlayerManager.prototype.processActions = function (actions) {
    var me = this;

    //process moves
    actions.forEach(function (actionObj) {
        var player = me.playersInfo[actionObj.player].player,
            action = actionObj.action;

        if (me.actionTypes.move.indexOf(action) > -1 && me.canDoMove(action, actionObj.moveData.surrounding)) {
            player.performAction(action);
        }
    });

    //process fire
    actions.forEach(function (actionObj) {
        var actor = me.playersInfo[actionObj.player].player,
            victim = actionObj.moveData.playerInSight,
            action = actionObj.action;

        if (me.actionTypes.assault.indexOf(action) > -1) {
            if (victim && victim.victim && victim.prevAimedDir === victim.currentPosition[victim.aimedDir]) {
                victim.hit();
            }
        }

        actor.checkPositionChange();
    });

    //process rotate
    actions.forEach(function (actionObj) {
        var player = me.playersInfo[actionObj.player].player,
            action = actionObj.action;

        if (me.actionTypes.rotate.indexOf(action) > -1) {
            player.performAction(action);
        }
    });
};


