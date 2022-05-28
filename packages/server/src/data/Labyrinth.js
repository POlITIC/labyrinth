const db = require("./db");
const {COLLECTION_LABYRINTHS_NAME} = require("./constants");

let labyrinthCollection;

const getCollection = () => {
    if (!labyrinthCollection) {
        labyrinthCollection = db.getCollection(COLLECTION_LABYRINTHS_NAME);
    }
};

const getLabyrinthsByUser = (userId) => {
    getCollection();

    return labyrinthCollection.find({userId});
};

/**
 *
 * @param {string} labyrinthId Labyrinth name
 * @return {*}
 */
const getLabyrinthById = (labyrinthId) => {
    getCollection();

    return labyrinthCollection.find({labyrinthId})[0];
}

const getAllAvailableLabyrinths = () => {
    getCollection();

    return labyrinthCollection.find({available: true});
};

const addOrUpdateLabyrinth = (userId, labyrinthId, {map, available}) => {
    getCollection();

    let labyrinth = labyrinthCollection.find({
        userId, labyrinthId
    })[0];


    if (!labyrinth) {
        labyrinthCollection.insert({userId, labyrinthId, map, available});
    } else {
        if(map){
            labyrinth.map = map;
        }

        if(typeof available !== "undefined"){
            labyrinth.available = available;
        }

        labyrinthCollection.update(labyrinth);
    }
};


module.exports = {
    getLabyrinthsByUser, addOrUpdateLabyrinth, getLabyrinthById, getAllAvailableLabyrinths
};
