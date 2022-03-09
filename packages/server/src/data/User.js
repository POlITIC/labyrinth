const db = require("./db");
const {COLLECTION_USERS_NAME} = require("./constants");

const getUser = (data) => {
    const users = db.getCollection(COLLECTION_USERS_NAME);

    return users.find({name: data.name})[0];
};

const createUser = (data) => {
    const users = db.getCollection(COLLECTION_USERS_NAME);

    return users.insert({...data, created: Date.now()});
};

const getOrCreateUser = (data) => {
    let user = getUser(data);

    if(!user){
        user = createUser(data);
    }

    return user;
};


module.exports = {getOrCreateUser};
