export default ({botName, color}, store) => {
    const {botsMatchColors} =  store;

    botsMatchColors[botName] = color;

    return botsMatchColors;
};
