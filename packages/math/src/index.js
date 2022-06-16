const DeathMatch = require("./deathmatch/DeathMatch");

const setupGame = (labyrinthConf, botConfigs) => {
    return new DeathMatch(labyrinthConf, botConfigs);
};


module.exports = {
    setupGame
}
