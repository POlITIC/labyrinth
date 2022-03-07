/**
 * Dumb script "Running rambo". Just runs and shoots at the same time. And yells.
 * @author Viktor Sobolevskiy <v.sobolevskiy@netent.com>
 * @date 2017-03-23
 */
if (!savedData["initialized"]) {
    savedData["pool"] = [];
    savedData["DIR"] = {
        "0": "up",
        "1": "right",
        "2": "down",
        "3": "left",
        "up": 0,
        "right": 1,
        "down": 2,
        "left": 3
    };
    savedData["DIR_FIX"] = {
        "0": 3,
        "1": 0,
        "2": 1,
        "3": 2
    };
    savedData["getPass"] = function getPass(direction, surrounding) {

        if (direction >= surrounding.length) {
            direction = 0;
        } else if (direction < 0) {
            direction = surrounding.length - 1;
        }

        return direction;
    };
    savedData["findPath"] = function findPath(direction, surrounding) {

        var getPass = savedData["getPass"],
            index = direction + 1;

        // Check right-hand side always
        index = getPass(index, surrounding);

        if (surrounding[index] === 0) {
            return index;
        }

        // Now check forward
        index = getPass(direction, surrounding);

        if (surrounding[index] === 0) {
            return index;
        }

        // Left-hand side
        index = direction - 1;
        index = getPass(index, surrounding);

        if (surrounding[index] === 0) {
            return index;
        }

        // Screw dead ends, going backward
        index -= 1;
        return getPass(index, surrounding);
    };
    savedData["initialized"] = true;
}

var DIR = savedData["DIR"],
    DIR_FIX = savedData["DIR_FIX"],
    findPath = savedData["findPath"],
    surrounding = data["surrounding"],
    direction = DIR_FIX[data["direction"]],
    pool = savedData["pool"],
    cmd;

// Execute commands queue first, if not empty
if (pool.length) {
    cmd = pool.pop();

    return cmd;
}

// Decide where to go
cmd = DIR[findPath(direction, surrounding)];

// Look at direction of our movement
if (direction !== DIR[cmd]) {
    pool.push(cmd);
    pool.push("fire");
    cmd = "direction_" + cmd;

    return cmd;
}

pool.push(cmd);

return "fire";
