import {actions} from "../enums";

export const loginAction =  (name) => {
	return {
		type: actions.LOGIN_ACTION,
		value: {name}
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
