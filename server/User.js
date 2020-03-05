const Player = require("./Player"),
    Labyrinth = require("./Labyrinth");

function User(name) {
    this.name = name;
    this.players = [];
    this.codeCallback;

    this.init();
}

User.prototype.init = function () {
    this.createLabyrinth();
};

User.prototype.addCode = function (codeString) {
    this.codeCallback = eval(codeString);
    this.createAndAddPlayer()
};

User.prototype.createAndAddPlayer = function (name) {
    var me = this,
        player;

    player = new Player({
        cb: me.codeCallback,
        name: name || this.name
    });
};

User.prototype.update = function () {
    
};

User.prototype.createLabyrinth = function () {
    this.labyrinth = new Labyrinth();
};


module.exports = User;