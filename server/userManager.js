const User = require("./User");

var users = {};

function getOrCreateUser(name) {

    if(!name){
        throw new Error("UserName is undefined");
    }

    if(!users.name){
        users[name] = new User(name);
    }

    return users[name]
}

module.exports = {
    getOrCreateUser: getOrCreateUser
};