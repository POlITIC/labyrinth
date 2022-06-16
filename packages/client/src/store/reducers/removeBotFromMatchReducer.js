export default (botName, state) => {
    const bots = state.botsSelectedToMatch;
    const index = bots.indexOf(botName);

    bots.splice(index, 1);

    return bots;
}
