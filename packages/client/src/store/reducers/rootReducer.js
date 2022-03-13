import loginReducer from "./loginReducer";
import {actions} from "../enums";
import labyrinthReducer from "./labyrinthReducer";
import stageReducer from "./stageReducer";
import codeReducer from "./codeReducer";
import setBotsReducer from "./setBotsReducer";
import setCurrentBotReducer from "./setCurrentBotReducer";

export default function reducer(state, {type, value}) {
	switch(type) {
		case actions.LOGIN_ACTION: state.loginData = loginReducer(value); break;
		case actions.SHOW_LAB_ACTION: state.labConfig = labyrinthReducer(value); break;
		case actions.SET_STAGE: state.stage = stageReducer(value); break;
		case actions.UPDATE_CODE: state.code = codeReducer(value); break;
		case actions.SET_BOTS: state.bots = setBotsReducer(value); break;
		case actions.SET_CURRENT_BOT: state.currentBot = setCurrentBotReducer(value); break;
	}

	return Object.assign({}, state);
}
