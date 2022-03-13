const usersSess = {};
const usersModelId = {};

class User {
    constructor(model) {
        this.model = model;
        this.sessId = '_' + Math.random().toString(36).substr(2, 9);
        this.loggedIn = Date.now(); // TODO delete user when session expires
        this.socket = null;

        usersSess[this.sessId] = this;
        usersModelId[this.model.$loki] = this;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    getClientData() {
        return {...this.model, sessId: this.sessId};
    }

    destroy () {
        // TODO Should delete object and remove socket connection, maybe smth else
    }

};

const getUserById = (id) => {
    return usersSess[id];
};

const getOrCreateUser = (model) => {
    const user =  usersModelId[model.$loki];

    return user ? user : new User(model);
};

module.exports = {
    User, getOrCreateUser, getUserById
}
