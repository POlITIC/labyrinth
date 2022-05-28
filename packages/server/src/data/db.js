const loki = require("lokijs");
const {COLLECTION_USERS_NAME, COLLECTION_BOTS_NAME, DB_NAME, COLLECTION_MATCHES_NAME} = require("./constants");

const collections = [COLLECTION_USERS_NAME, COLLECTION_BOTS_NAME, COLLECTION_MATCHES_NAME];

const onDBInit = () => {
    collections.forEach((name) => {
        const entries = db.getCollection(name);

        if (entries === null) {
            db.addCollection(name);
        }
    });
    console.log("Database ready!");
};

const db = new loki(DB_NAME, {
    autoload: true,
    autoloadCallback : onDBInit,
    autosave: true,
    autosaveInterval: 4000
});

module.exports = db;
