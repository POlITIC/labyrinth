const getOneColor = () => Math.floor(256 * Math.random());

export const createRandomColor = () => {
    const r = getOneColor().toString(16);
    const g = getOneColor().toString(16);
    const b = getOneColor().toString(16);

    let array = [r, g, b];

    array = array.map((color) => {
        if(color.length === 1){
            return "0"+color;
        }
        return color;
    });

    return parseInt(array.join(""), 16);
};
