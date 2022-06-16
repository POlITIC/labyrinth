const db = require("./db");
const {COLLECTION_MATCHES_NAME} = require("./constants");

let matchCollection;

const getMatchCollection = () => {
    if (!matchCollection) {
        matchCollection = db.getCollection(COLLECTION_MATCHES_NAME);
    }
};

const getMatchesByUser = (userId) => {
    getMatchCollection();

    return matchCollection.find({userId});
};

/**
 *
 * @param userId
 * @param {number} id index of entry, starts with 0
 * @return {*}
 */
const getMatchById = (userId, id) => {
    getMatchCollection();
    const entries = matchCollection.find({userId});

    return entries[id];
}

const addMatch = (userId, matchLog) => {
    getMatchCollection();

    matchCollection.insert({userId, matchLog, created: Date.now()});
};

module.exports = {
    getMatchesByUser, addMatch, getMatchById
};
