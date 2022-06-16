export default (botName, state) => {
    const addedBots = state.botsSelectedToMatch;

    if(!addedBots.includes(botName)){
        addedBots.push(botName);
    }

    return addedBots;
};

