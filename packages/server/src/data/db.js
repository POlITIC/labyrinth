const loki = require("lokijs");
const {COLLECTION_USERS_NAME, COLLECTION_BOTS_NAME, DB_NAME, COLLECTION_MATCHES_NAME,
    COLLECTION_LABYRINTHS_NAME,
    ADMIN_USER_NAMES,
    PRIMAL_LABYRINTH_ID
} = require("./constants");
const {getPrimeLabyrinthConfig} = require("../labyrinth");

const collections = [COLLECTION_USERS_NAME, COLLECTION_BOTS_NAME, COLLECTION_MATCHES_NAME, COLLECTION_LABYRINTHS_NAME];

const addInitLabyrinth = () => {
    const admin = db.getCollection(COLLECTION_USERS_NAME).find(ADMIN_USER_NAMES[0])[0];
    const labyrinthCollection = db.getCollection(COLLECTION_LABYRINTHS_NAME);

    const labyrinth = labyrinthCollection.find({labyrinthId: PRIMAL_LABYRINTH_ID})[0];

    if (!labyrinth) {
        labyrinthCollection.insert({userId: admin.$loki, labyrinthId: PRIMAL_LABYRINTH_ID, map: getPrimeLabyrinthConfig(), available: true});
    }
};

const onDBInit = () => {
    collections.forEach((name) => {
        const entries = db.getCollection(name);

        if (entries === null) {
            db.addCollection(name);
        }
    });

    addInitLabyrinth();

    console.log("Database ready!");
};

const db = new loki(DB_NAME, {
    autoload: true,
    autoloadCallback : onDBInit,
    autosave: true,
    autosaveInterval: 4000
});


module.exports = db;
