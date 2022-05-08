/*
moveData object is available to you as a global object that contains all available info.
moveData: {
    // your position in labyrinth
    position: {
        left: number,
        top: number
    },
    // Shows what is surrounding you. 1 when there is a wall, 0 - no wall
    surround: {
        left: 0|1,
        top: 0|1,
        right: 0|1,
        bottom: 0|1
    },
    orientation: "LEFT"|"RIGHT"|"UP"|"DOWN",
    saveData: Object // anything to save between moves
}

Possible actions are: 'MOVE_LEFT', 'MOVE_UP', 'MOVE_RIGHT', 'MOVE_DOWN', 'LOOK_LEFT', 'LOOK_UP', 'LOOK_RIGHT', 'LOOK_DOWN', 'FIRE'

You need to return one or two of those actions in an array, examples: ['MOVE_LEFT', 'MOVE_UP'], ['LOOK_UP', 'MOVE_RIGHT'], ['LOOK_UP', 'FIRE'], ['MOVE_RIGHT'], ['FIRE']
*/

//TODO SCRIPT EXECUTION TOOK TOO MUCH TIME SOMEHOW!!! FIND WHY???

const surKeyToDir = (key) => {
    const map = {
        left: "LEFT",
        top: "UP",
        bottom: "DOWN",
        right: "RIGHT"
    };

    return map[key];
};

const equalHistoryItems = (h1, h2) => {
    return h1.pos.left === h2.pos.left
        && h1.pos.right === h2.pos.right
        && h1.dir === h2.dir
};

const getNextPos = (dir) => {
    switch(dir){
        case "LEFT": return {left: position.left - 1, top: position.top};
        case "RIGHT": return {left: position.left + 1, top: position.top};
        case "UP": return {left: position.left, top: position.top - 1};
        case "DOWN": return {left: position.left, top: position.top + 1};
    }
};

const historyThreshold = 15;
// history format {pos: {}, dir: {}};

const {saveData, surround, orientation, position, enemyInView} = moveData;
const cmds = [];

if (!saveData.history) {
    saveData.history = [];
}

const {history} = saveData;

const freeDirections = Object.keys(surround)
    .filter((key) => {
        return !Boolean(surround[key]);
    })
    .map(freeKey => surKeyToDir(freeKey));

let dirToMove = saveData.prevMoveDir || "UP";

const prevPos = history[history.length - 1] && history[history.length - 1].pos;

// TODO sort possible variants by amount of positions hit, to prioritize least visited positions.
if (!freeDirections.includes(saveData.prevMoveDir)) {
    dirToMove = freeDirections[0];

    if (freeDirections.length > 1) {
        // dirToMove = freeDirections[Math.floor(Math.random() * freeDirections.length)];
        freeDirections.forEach((dir) => {

            // checking for repetition in last N moves
            // let repeated = false;
            // for (let i = history.length - 1; i >= Math.max(0, history.length - historyThreshold); i--) {
            //     const hi = history[i];
            //
            //     if (equalHistoryItems(hi, {pos: position, dir})) {
            //         repeated = true;
            //     }
            // }

            // NO GOING BACK
            const nextPos = getNextPos(dir);

            if(prevPos && (prevPos.left !== nextPos.left || prevPos.top !== nextPos.top)){
                dirToMove = dir;
            }

        });

    }

} else {
    if (freeDirections.length > 1) {
        // TODO there is a choice where to go, but how to choose??
    }
}

const nextPos = getNextPos(dirToMove);

console.log(prevPos, position, nextPos, dirToMove);

if(prevPos && (prevPos.left === nextPos.left && prevPos.top === nextPos.top)){
    console.log("GOING BACK",freeDirections, freeDirections.length);
}

if (orientation !== dirToMove) {
    cmds.push(`LOOK_${dirToMove}`);
} else {
    if(enemyInView){
        cmds.push("FIRE");
    }
}

cmds.push(`MOVE_${dirToMove}`);

saveData.prevMoveDir = dirToMove;
saveData.history.push({
    pos: {...position},
    dir: dirToMove
});

return cmds;


