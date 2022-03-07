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
    console.log("USER LOGIN DATA", data);

    let user = getUser(data);

    if(!user){
        user = createUser(data);
    }

    console.log("result user", user);
    return user;
};


module.exports = {getOrCreateUser};
