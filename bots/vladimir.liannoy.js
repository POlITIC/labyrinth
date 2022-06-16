function move(where) {
        if (dir == where) {
            return where;
        } else {
            return "direction_" + where;
        }
    }

    if (data.playerInSight) {
        return "fire";
    }

    var sur = data.surrounding,

        dirs = ["left", "up", "right", "down"],
        dir = dirs[data.direction],

        canGoUp = sur[0] == 0,
        canGoRight = sur[1] == 0,
        canGoDown = sur[2] == 0,
        canGoLeft = sur[3] == 0,

        opora = savedData.opora ? savedData.opora : "down";

    if (opora == "down") {
        if (canGoDown) {
            savedData.opora = opora = "left";
            return "down";
            //return move("down");
        } else {
            if (canGoRight) {
                return move("right");
            } else {
                savedData.opora = opora = "right";
            }
        }
    }

    if (opora == "right") {
        if (canGoRight) {
            savedData.opora = opora = "down";
            return "right";
            //return move("down");
        } else {
            if (canGoUp) {
                return move("up");
            } else {
                savedData.opora = opora = "up";
            }
        }
    }

    if (opora == "up") {
        if (canGoUp) {
            savedData.opora = opora = "right";
            return "up";
            //return move("up");
        } else {
            if (canGoLeft) {
                return move("left");
            } else {
                savedData.opora = opora = "left";
            }
        }
    }

    if (opora == "left") {
        if (canGoLeft) {
            savedData.opora = opora = "up";
            return "left";
            //return move("left");
        } else {
            if (canGoDown) {
                return move("down");
            } else {
                savedData.opora = opora = "right";
            }
        }
    }
