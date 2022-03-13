const db = require("./db");
const {COLLECTION_BOTS_NAME} = require("./constants");

let botCollection;

const getBotCollection = () => {
    if (!botCollection) {
        botCollection = db.getCollection(COLLECTION_BOTS_NAME);
    }
};

const addOrUpdateBot = (userId, botName, code) => {
    getBotCollection();

    let bot = botCollection.find({
        userId, botName
    })[0];


    if (!bot) {
        botCollection.insert({userId, botName, code});
    } else {
        bot.code = code;
        botCollection.update(bot);
    }
};

const getBot = (userId, botName) => {
    getBotCollection();

    return botCollection.find({
        userId, botName
    })[0];
};

const getUserBots = (userId) => {
    getBotCollection();

    const bots = botCollection.find({
        userId
    });

    console.log(bots);

    return bots;
};

module.exports = {
    addOrUpdateBot, getBot, getUserBots
};
