var Player = require("./Player"),
    Global = require("./Global"),
    vm = require("vm"),
    labyrinth = require("./labyrinth"),
    actionTypes = {
        move: ["left", "right", "up", "down"],
        assault: ["fire"],
        rotate: ["direction_left", "direction_right", "direction_up", "direction_down"]
    },
    players = [],
    playerInfos = {};

function createPlayer(callbackString, name) {

    if(!playerInfos[name]){
        var player = new Player({
            cb: eval(callbackString),
            name: name
        });

        players.push(player);
        playerInfos[name] = player;

    }else{
        playerInfos[name].moveCalslback = eval(callbackString);
    }
};

function getPlayerPositions() {
    var result = {};

    for (var name in playerInfos) {
        if (playerInfos.hasOwnProperty(name)) {
            var p = playerInfos[name];
            result[name] = {
                pos: p.currentPosition,
                dir: p.direction,
                dead: p.dead
            }
        }
    }

    return result;
}

function makeMove() {
    var actions = [];

    players.forEach(function (player) {

        if (player.dead === true) {
            return;
        }

        var data = _getPlayerData(player),
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

    _processActions(actions);
};

function _getPlayerData(player) {
    var pos = player.currentPosition,
        rotation = player.direction,
        surrounding = player.getSurrounding(),
        playerInSight = _getInterception(pos, rotation, player),
        playersAlive = _countAlivePlayers();


    return {
        surrounding: surrounding,
        pos: pos,
        direction: rotation,
        exit: player.exitPoint,
        playerInSight: playerInSight,
        playersAlive: playersAlive
    };
}

function _canDoMove(action, surrounding) {
    var actionPos = {
        up: 0,
        right: 1,
        down: 2,
        left: 3
    };

    return surrounding[actionPos[action]] === 0;
}

function _processActions(actions) {
    //process moves
    actions.forEach(function (actionObj) {
        var player = playerInfos[actionObj.player],
            action = actionObj.action;

        if (actionTypes.move.indexOf(action) > -1 && _canDoMove(action, actionObj.moveData.surrounding)) {

            
            player.performAction(action);
        }
    });

    //process fire
    actions.forEach(function (actionObj) {
        var actor = playerInfos[actionObj.player],
            victim = actionObj.moveData.playerInSight,
            action = actionObj.action;

        if (actionTypes.assault.indexOf(action) > -1) {
            if (victim && victim.victim && victim.prevAimedDir === victim.currentPosition[victim.aimedDir]) {
                victim.hit();
            }
        }
        actor.checkPositionChange();
    });

    //process rotate
    actions.forEach(function (actionObj) {
        var player = playerInfos[actionObj.player],
            action = actionObj.action;

        if (actionTypes.rotate.indexOf(action) > -1) {
            player.performAction(action);
        }
    });
}

function _getInterception(pos, rot, actor) {
    var playerInSight = false,
        wallInBetween = false,
        distance, inc,
        i;

    players.forEach(function (player) {
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
                    if (labyrinth.getCurrentConfig()[pos.left][i]) {
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
                        if (labyrinth.getCurrentConfig()[i][pos.top]) {
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

    console.log("VIC", playerInSight);

    return playerInSight;
};

function _countAlivePlayers() {
    var result = 0;

    players.forEach(function (p) {
        if (!p.dead) {
            result++;
        }
    });

    return result;
}

module.exports = {
    createPlayer: createPlayer,
    makeMove: makeMove,
    getPlayerPositions: getPlayerPositions
};