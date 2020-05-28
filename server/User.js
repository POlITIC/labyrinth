const Player = require("./Player"),
    Labyrinth = require("./Labyrinth");

class User {
    constructor(name) {
        this.name = name;
        this.players = [];

        this.init();
    }

    init() {
        this.createLabyrinth();
    }

    addCode(codeString) {
        this.codeCallback = eval(codeString);
        this.createAndAddPlayer()
    }

    createAndAddPlayer(name) {
        new Player({
            labyrinth: this.labyrinth,
            cb: this.codeCallback,
            name: name || this.name
        });
    }

    update() {

    }

    createLabyrinth() {
        this.labyrinth = new Labyrinth();
    }
}

module.exports = User;
