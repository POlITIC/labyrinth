const db = require("./db");
const {COLLECTION_USERS_NAME} = require("./constants");
const {getOrCreateUser} = require("../user/User");

const ADMIN_USER_NAMES = ["admin"];

const getUser = (data) => {
    const users = db.getCollection(COLLECTION_USERS_NAME);

    return users.find({name: data.name})[0];
};

const createUser = (data) => {
    const users = db.getCollection(COLLECTION_USERS_NAME);

    //TODO create a real way to add admins
    if (ADMIN_USER_NAMES.includes(data.name)) {
        data.admin = true;
    }

    return users.insert({...data, created: Date.now()});
};

const loginUser = (data) => {
    let user = getUser(data);

    // TODO maybe worth to do this in user/User.js
    return getOrCreateUser(user ? user : createUser(data));
};

module.exports = {loginUser};
