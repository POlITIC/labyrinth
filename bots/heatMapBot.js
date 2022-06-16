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

const surKeyToDir = (key) => {
    const map = {
        left: "LEFT",
        top: "UP",
        bottom: "DOWN",
        right: "RIGHT"
    };

    return map[key];
};

const getNextPos = (dir) => {
    switch(dir){
        case "LEFT": return {left: position.left - 1, top: position.top};
        case "RIGHT": return {left: position.left + 1, top: position.top};
        case "UP": return {left: position.left, top: position.top - 1};
        case "DOWN": return {left: position.left, top: position.top + 1};
    }
};

const {saveData, surround, orientation, position, enemyInView} = moveData;
const cmds = [];

if (!saveData.history) {
    saveData.history = [];
}

if(!saveData.mapData){
    saveData.mapData = [];
}

if(!saveData.mapData[position.left]){
    saveData.mapData[position.left] = [];
}

if(!saveData.mapData[position.left][position.top]){
    saveData.mapData[position.left][position.top] = 1;
}else{
    saveData.mapData[position.left][position.top] += 1;
}

const {history, mapData} = saveData;

const freeDirections = Object.keys(surround)
    .filter((key) => {
        return !Boolean(surround[key]);
    })
    .map(freeKey => surKeyToDir(freeKey))
    .sort((d1, d2)=> {
        const nextPos1 = getNextPos(d1);
        const nextPos2 = getNextPos(d2);

        const h1 = mapData[nextPos1.left]?.[nextPos1.top] || 0;

        const h2 = mapData[nextPos2.left]?.[nextPos2.top] || 0;

        return h1 - h2;
    });

let dirToMove = freeDirections[0] || "UP";

const prevPos = history[history.length - 1] && history[history.length - 1].pos;

if (orientation !== dirToMove) {
    cmds.push(`LOOK_${dirToMove}`);
} else {
    if(enemyInView){
        console.log("FIRE");
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


