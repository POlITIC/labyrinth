import store from "./store/store";
import {loginAction} from "./store/actionCreators/ActionCreator";

const SERVER_URL = "http://localhost:4040";

const METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT"
};

const request = (method, data, url) => {
    data = {...data, sessId: store.getState().loginData.sessId};

    return new Promise((resolve, reject) => {
        fetch(SERVER_URL + url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(async (response) => {
            if (response.status >= 200 && response.status < 300 && response.ok) {
                const respObj = await response.json();

                // TODO add action processing for response actions.
                if (respObj.action === "logout") {
                    // should logout
                    store.dispatch(loginAction({}));
                }

                resolve(respObj);
            } else {
                console.error("POST failed", response);
                reject(resolve);
            }
        });
    });
};

/**
 *
 * @param {Object} data
 * @param {string} url
 * @return {Promise<Response>}
 */
const post = (data, url) => {
    return request(METHODS.POST, data, url);
};

export const login = (name) => {
    return post({name}, "/login");
};


/**
 * @param {string} id
 */
export const getLabyrinth = (id) => {
    return post({id}, "/labyrinth")
};

export const getAllBots = () => {
    return post({}, "/getAllBots")
};

export const submitCode = (botName, code) => {
    return post({
        botName,
        code
    }, "/saveBotCode");
};

export const getBotData = (botName) => {
    return post({
        botName
    }, "/getBotData");
};

export const deleteBot = (botName) => {
    return post({
        botName
    }, "/deleteBot");
};

export const startMatch = () => {
    return post({
        bots: store.getState().botsSelectedToMatch
    }, "/startMatch");
};

export const stopMatch = () => {
    return post({}, "/stopMatch");
}

export const userAvailableLabyrinth = () => post({}, "/userAvailableLabyrinth");
