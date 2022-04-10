const {setupGame} = require("math");
const {getUserBots} = require("../data/Bot");
const labyrinth = require("../labyrinth");
const usersSess = {};
const usersModelId = {};
const DEFAULT_FRAME_TIME = 50;

class User {
    constructor(model) {
        this.model = model;
        this.sessId = '_' + Math.random().toString(36).substr(2, 9);
        this.loggedIn = Date.now(); // TODO delete user when session expires
        this.socket = null;
        this.game = null;
        this.playing = false;
        this.matchTimeout = null;

        usersSess[this.sessId] = this;
        usersModelId[this.model.$loki] = this;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    getClientData() {
        return {...this.model, sessId: this.sessId};
    }

    startMatch(bots) {
        const botConfigs = getUserBots(this.model.$loki).filter(({botName}) => bots.includes(botName));
        this.game = setupGame(labyrinth.getCurrentConfig(), botConfigs)

        this.playing = true;
        this.play();
        console.error("NEW MATCH");

        return this.game.getBots();
    }

    play() {
        if (this.playing) {
            const stats = this.game.tick();

            // console.log("stats", stats.length, stats.map(s => {
            //     return `${s.i}:${JSON.stringify(s.p)}:${s.d}`;
            // }).join("\n"));

            this.socket.emit("gameTick", stats);

            if(this.game.eachLiveBot.length === 1){
                this.stop();
            }

            this.matchTimeout = setTimeout(() => {
                this.play();
            }, DEFAULT_FRAME_TIME);
        }
    }

    stop() {
        this.playing = false;

        if(this.matchTimeout){
            clearTimeout(this.matchTimeout);
        }
        console.log("STOP MATCH");
    }

    destroy() {
        // TODO Should delete object and remove socket connection, maybe smth else
    }

};

const getUserById = (id) => {
    return usersSess[id];
};

const getOrCreateUser = (model) => {
    const user = usersModelId[model.$loki];

    return user ? user : new User(model);
};

module.exports = {
    User, getOrCreateUser, getUserById
}
