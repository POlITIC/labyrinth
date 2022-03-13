import loginReducer from "./loginReducer";
import {actions} from "../enums";
import labyrinthReducer from "./labyrinthReducer";
import stageReducer from "./stageReducer";
import codeReducer from "./codeReducer";
import setBotsReducer from "./setBotsReducer";
import setCurrentBotReducer from "./setCurrentBotReducer";
import addBotToMatchReducer from "./addBotToMatchReducer";
import removeBotFromMatchReducer from "./removeBotFromMatchReducer";

export default function reducer(state, {type, value}) {
	switch(type) {
		case actions.LOGIN_ACTION: state.loginData = loginReducer(value, state); break;
		case actions.SHOW_LAB_ACTION: state.labConfig = labyrinthReducer(value, state); break;
		case actions.SET_STAGE: state.stage = stageReducer(value, state); break;
		case actions.UPDATE_CODE: state.code = codeReducer(value, state); break;
		case actions.SET_BOTS: state.bots = setBotsReducer(value, state); break;
		case actions.SET_CURRENT_BOT: state.currentBot = setCurrentBotReducer(value, state); break;
		case actions.ADD_BOT_TO_MATCH: state.botsSelectedToMatch = addBotToMatchReducer(value, state); break;
		case actions.REMOVE_BOT_FROM_MATCH: state.botsSelectedToMatch = removeBotFromMatchReducer(value, state); break;
	}

	return Object.assign({}, state);
}
