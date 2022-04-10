const calculateDistance = (pos1, pos2) => {
    return Math.abs(Math.sqrt(Math.pow(pos1.left - pos2.left, 2) + Math.pow(pos1.top - pos2.top, 2)));
};

const calculateMinDistance = (posArr, pos) => {
    return posArr.reduce((prevDist, botPos, index) => {
        const distance = calculateDistance(botPos, pos);
        if(index === 0){
            return distance;
        }

        return Math.min(prevDist, distance);
    });
};

module.exports = {
    calculateDistance, calculateMinDistance
}
