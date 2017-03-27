
var savedData = {};

var data = {

};


function main() {

    try{
       var action = "fire",

        WALL = -1,
        EMPTY = 0;

    function getDist(n1, n2) {
        return Math.sqrt( (n1.x - n2.x)*(n1.x - n2.x) + (n1.y - n2.y)* (n1.y - n2.y))
    }

    function getCurrPosNode() {
        return createNode(savedData.pos[0], savedData.pos[1]);
    }

    function removeNode(array, node) {
        var index = array.indexOf(node);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    function attendMapPoint(x, y) {
        var map = savedData.map;

        if(!map[x]){
          map[x] = [];
        }

        //set weight to 1 (first time here)
        if(map[x][y] == null || map[x][y] < 0){
            map[x][y] = 1;
            return
        }

        map[x][y] += 1;
    }

    function trySetEmptySpace(x, y) {
        var map = savedData.map;

        if(!map[x]){
            map[x] = [];
        }

        if(map[x][y] == null){
            map[x][y] = EMPTY;
        }
    }

    function setWall(x, y) {
        var map = savedData.map;

        if(!map[x]){
            map[x] = [];
        }

        map[x][y] = WALL;
    }

    function getMapColor(x, y) {
        var map = savedData.map;
        if(!map[x]){
            return 0;
        }

        if(!map[x][y]){
            return 0;
        }

        return map[x][y];
    }

    function fillMap(){
        var sensors = data.surrounding,
            pos = savedData.pos;

        //mark current position point as "attended"
        //increase weight
        attendMapPoint(pos[0], pos[1]);

        //up direction
        if(sensors[0] == 1){
            setWall(pos[0], pos[1]-1);
        }else{
            trySetEmptySpace(pos[0], pos[1]-1);
        }

        //right
        if(sensors[1] == 1){
            setWall(pos[0] + 1, pos[1]);
        }else{
            trySetEmptySpace(pos[0] + 1, pos[1]);
        }

        //bot
        if(sensors[2] == 1){
            setWall(pos[0] , pos[1] + 1);
        }else{
            trySetEmptySpace(pos[0] , pos[1] + 1);
        }

        //left
        if(sensors[3] == 1){
            setWall(pos[0] - 1, pos[1]);
        }else{
            trySetEmptySpace(pos[0] - 1, pos[1]);
        }
    }

    function initMap(){
        if(!savedData.map){
            savedData.map = [];
        }

        fillMap();
    }

    function initPlayer() {
        switch(data.direction){
            case 0 : {
                savedData.dirVec = [-1, 0];
            }break;

            case 1: {
                savedData.dirVec = [0, -1];
            }break;

            case 2 : {
                savedData.dirVec = [1, 0];
            }break;

            case 3 : {
                savedData.dirVec = [0, 1];
            }break;
        }
        savedData.mV = savedData.mV ? savedData.mV : [1, 0];
        savedData.pos = [data.pos.left, data.pos.top];

        if(savedData.lookOutCounter == null){
            savedData.lookOutCounter = 0;
        }
    }

    function createNode(x, y, isWall){
        return {
            x : x,
            y : y,
            f : 0,
            g : 0,
            h : 0,
            wall : isWall,
            visited: false,
            closed : false,
            parent : null
        }
    }

    function generateGrid(map) {
        var grid = [],
            mxl, myl = 0;

        mxl = map.length;

        for(var i=0; i < mxl; i++){
            if(map[i] && map[i].length > myl){
                myl = map[i].length;
            }
        }

        for(var i=0; i<mxl; i++){
            if(!grid[i]){
                grid[i] = [];
            }
            for(var j=0; j<myl; j++){
                var isWall = (map[i] == null || map[i][j] == null || map[i][j] === -1);

                grid[i][j] = createNode(i, j, isWall);
            }
        }

        return grid;
    }

    function getNode(grid, nx, ny){
        if(grid[nx] && grid[nx][ny]){
            return grid[nx][ny];
        }
        return null;
    }

    function getNeighbours(node, grid) {
        var succesors = [],
            nx = node.x,
            ny = node.y,
            node;

        if(node = getNode(grid, nx + 1, ny)){
            succesors.push(node);
        }

        if(node = getNode(grid, nx - 1, ny)){
            succesors.push(node);
        }

        if(node = getNode(grid, nx, ny + 1)){
            succesors.push(node);
        }

        if(node = getNode(grid, nx, ny - 1)){
            succesors.push(node);
        }

        return succesors;
    }



    function pathTo(node) {
        var path = [],
            cn = node;

        path.push(cn);
        while(cn.parent){
            cn = cn.parent;
            path.push(cn);
        }

        return path.reverse();
    }

    function pathSearch(tx, ty) {
        var map = savedData.map,
            grid = generateGrid(map),
            start = grid[savedData.pos[0]][savedData.pos[1]],
            end = grid[tx][ty],

            openHeap = [];


        start.h = getDist(start, end);
        start.closed = true;

        openHeap.push(start);

        while (openHeap.length > 0) {
            var currentNode = openHeap.pop();

            if (currentNode === end) {
                return pathTo(currentNode);
            }

            currentNode.closed = true;
            var neighbors = getNeighbours(currentNode, grid);

            for (var i = 0, il = neighbors.length; i < il; i++) {
                var neighbor = neighbors[i];

                if (neighbor.closed || neighbor.wall || openHeap.indexOf(neighbor) >= 0) {
                    continue;
                }

                neighbor.parent = currentNode;

                if(neighbor === end){
                    return pathTo(neighbor);
                }

                neighbor.g = currentNode.g + getDist(currentNode, neighbor);
                neighbor.h = getDist(neighbor, end);
                neighbor.f = neighbor.h + neighbor.g;
                openHeap.push(neighbor);
            }

            openHeap.sort(function (a, b) {
                return b.f - a.f;
            });
        }
        return [];
    }

    function getNormVector(n1, n2) {
        var dist = getDist(n1, n2);
        return [ Math.round((n2.x - n1.x)/dist), Math.round((n2.y - n1.y)/dist) ];
    }

    function vecToCommand(vec) {
        var dx = vec[0], dy = vec[1];

        if(dx > 0 && dy === 0){
            return "right"
        }
        if(dx < 0 && dy === 0){
            return "left"
        }
        if(dx === 0 && dy > 0){
            return "down"
        }
        if(dx === 0 && dy < 0){
            return "up"
        }
    }
    
    
    function findMinWeightedPosition(map) {
        var x, y,
            minWeight = 1000000,
            positions = [],
            mwX, mwY;

        //find where to move
        for(x=0; x < map.length; x++){
            if(!map[x]){
                continue;
            }

            for(y = 0; y < map[x].length; y++){
                if( map[x][y] == null){
                    continue;
                }

                if(map[x][y] >= 0){
                    if(minWeight > map[x][y]){
                        minWeight = map[x][y];
                    }
                }

            }
        }

        for(x=0; x < map.length; x++){
            if(!map[x]){
                continue;
            }

            for(y = 0; y < map[x].length; y++){
                if( map[x][y] == null){
                    continue;
                }

                if(map[x][y] == minWeight){
                    positions.push({
                        x : x,
                        y : y
                    });
                }
            }
        }

        positions.sort(function (a, b) {
            return getDist(getCurrPosNode(), b) - getDist(getCurrPosNode(), a)
        });

        var closestPosition = positions.pop();

        return [ closestPosition.x, closestPosition.y ];
    }

    function decideMoveTarget(){
        var map = savedData.map,
            path,
            minWeightedPos;

        minWeightedPos = findMinWeightedPosition(map);

        path = pathSearch(minWeightedPos[0], minWeightedPos[1]);

        if(path.length === 0){
            console.error("CANT FIND NOTHING");
            return "fire";
        }

        //0 - current position
        //1 - next position
        var nextNode = path[1];

       return nextNode;
    }

    function getMoveNameToPos(pos){
        var node = pos instanceof Array ? createNode(pos[0], pos[1]) : pos;
        return vecToCommand(getNormVector(getCurrPosNode(), node));
    }


    function getOpositeDirectionName(dirName) {
        if(dirName === "up"){
            return "down"
        }

        if(dirName === "down"){
            return "up"
        }

        if(dirName === "left"){
            return "right"
        }

        if(dirName === "right"){
            return "left"
        }
    }

    
    function prepareRotation(rollBackPos, targetPos, newDirName, newDirVec){
        savedData.rotationData = {
            rollBackPos : rollBackPos,
            targetPos : targetPos,
            newDirVec : newDirVec,
            newDirName : newDirName,
            haveRotated : false
        };

        return getMoveNameToPos(rollBackPos)
    }

    function performRotation() {
        savedData.rotationData.haveRotated = true;
        savedData.mV = savedData.rotationData.newDirVec;
        savedData.lookOutCounter = 0;
        return "direction_" + savedData.rotationData.newDirName;
    }
    
    function performAfterRotation(targetPos) {
        return getMoveNameToPos(targetPos);
    }


    function prepareLookOut(originalDir) {
        savedData.lookOut = {
            originalDir : originalDir
        };

        return "direction_" + getOpositeDirectionName(originalDir);
    }

    function peforformAfterLookOut(originalDir) {
        return "direction_" + originalDir;
    }



    function defineAction() {
        var nextNode;
        if(data.playerInSight){
            return "fire";
        }

        if(savedData.rotationData){

            if(!savedData.rotationData.haveRotated){
                return performRotation();
            }else{
                var target = savedData.rotationData.targetPos;
                savedData.rotationData = null;
                return performAfterRotation(target);
            }

        }


        nextNode = decideMoveTarget();

        var newDirVec = getNormVector(getCurrPosNode(), nextNode);
        var currDirName = vecToCommand(savedData.mV);
        var newDirName = vecToCommand(newDirVec);


        if(currDirName !== newDirName){
            var rollBackPos = [ savedData.pos[0] - savedData.mV[0], savedData.pos[1] - savedData.mV[1] ];
            var targetPos = [savedData.pos[0], savedData.pos[1]];

            return prepareRotation(rollBackPos, targetPos, newDirName, newDirVec);
        }


        if(savedData.lookOutCounter >= 3){
            if(savedData.lookOut){
                var originalDir = savedData.lookOut.originalDir;
                savedData.lookOut = null;
                savedData.lookOutCounter = 0;
                return peforformAfterLookOut(originalDir);
            }
            return prepareLookOut(currDirName);
        }




        savedData.lookOutCounter++;


        return currDirName;
    }


    initPlayer();
    initMap();

    action = defineAction();

    return action;
    }catch (e){
        console.error("UNEXPECTED EXCEPTION", e);
        delete savedData.map;
        delete savedData.rotationData;
        delete savedData.dirVec;
        delete savedData.mV;
        delete savedData.pos;
        delete savedData.lookOut;
        delete savedData.lookOutCounter;

        return "fire";
    }
}



