import {actions} from "../enums";

export const loginAction =  (response) => {
	return {
		type: actions.LOGIN_ACTION,
		value: response
	};
}

export const setStage = (stageName) => {
	return {
		type: actions.SET_STAGE,
		value: stageName
	};
}

export const showLabAction = (config) => {
	return {
		type: actions.SHOW_LAB_ACTION,
		value: {config}
	};
}

export const updateCode = (codeString) => {
	return {
		type: actions.UPDATE_CODE,
		value:  codeString
	};
}

export const setBots = (bots) => {
	return {
		type: actions.SET_BOTS,
		value: bots
	};
}

export const clearBotsMatch = () => ({
	type: actions.CLEAR_BOTS_MATCH
});

export const setCurrentBot = (botName) => {
	return {
		type: actions.SET_CURRENT_BOT,
		value: botName
	};
};

export const addBotToMatch = (botName) => {
	return {
		type: actions.ADD_BOT_TO_MATCH,
		value: botName
	};
};

export const removeBotFromMatch = (botName) => {
	return {
		type: actions.REMOVE_BOT_FROM_MATCH,
		value: botName
	};
};
