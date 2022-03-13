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

export const setCurrentBot = (botName) => {
	return {
		type: actions.SET_CURRENT_BOT,
		value: botName
	};
};
