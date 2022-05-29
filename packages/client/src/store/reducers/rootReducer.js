import loginReducer from "./loginReducer";
import {actions} from "../enums";
import labyrinthReducer from "./labyrinthReducer";
import stageReducer from "./stageReducer";
import codeReducer from "./codeReducer";
import setBotsReducer from "./setBotsReducer";
import setCurrentBotReducer from "./setCurrentBotReducer";
import addBotToMatchReducer from "./addBotToMatchReducer";
import removeBotFromMatchReducer from "./removeBotFromMatchReducer";
import botColorReducer from "./botColorReducer";
import deadBotReducer from "./deadBotReducer";
import userAvailableLabsReducer from "./userAvailableLabsReducer";
import selectedLabyrinthReducer from "./selectedLabyrinthReducer";

export default function reducer(state, {type, value}) {
	switch(type) {
		case actions.LOGIN_ACTION: state.loginData = loginReducer(value, state); break;
		case actions.SHOW_LAB_ACTION: state.labConfig = labyrinthReducer(value, state); break;
		case actions.SET_STAGE: state.stage = stageReducer(value, state); break;
		case actions.UPDATE_CODE: state.code = codeReducer(value, state); break;
		case actions.SET_BOTS:state.bots = setBotsReducer(value, state);break;
		case actions.CLEAR_BOTS_MATCH:
            state.botsSelectedToMatch = [];
            state.deadBots = [];
            break;
		case actions.SET_CURRENT_BOT: state.currentBot = setCurrentBotReducer(value, state); break;
		case actions.ADD_BOT_TO_MATCH: state.botsSelectedToMatch = addBotToMatchReducer(value, state); break;
		case actions.REMOVE_BOT_FROM_MATCH: state.botsSelectedToMatch = removeBotFromMatchReducer(value, state); break;
		case actions.SET_BOT_COLOR: state.botsMatchColors = botColorReducer(value, state); break;
		case actions.START_MATCH: state.matchStarted = true; break;
		case actions.END_MATCH: state.matchStarted = false; break;
		case actions.DEAD_BOT: state.deadBots = deadBotReducer(value, state); break;
		case actions.USER_AVAILABLE_LABS: state.userAvailableLabs = userAvailableLabsReducer(value); break;
		case actions.SELECTED_LABYRINTH: state.selectedLabyrinth = selectedLabyrinthReducer(value); break;
	}

	return Object.assign({}, state);
}
