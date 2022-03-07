import DeathMatch from "./deathmatch/DeathMatch";

let game;
export const setupGame = (labyrinthConf, botConfigs) => {
    game = new DeathMatch(labyrinthConf, botConfigs);

    window.game = game;
};

export const tick = () => {
    game.tick();
};
