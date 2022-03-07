import loginReducer from "./loginReducer";
import {actions} from "../enums";
import labyrinthReducer from "./labyrinthReducer";
import stageReducer from "./stageReducer";
import codeReducer from "./codeReducer";

export default function reducer(state, action) {
	switch(action.type) {
		case actions.LOGIN_ACTION: state.loginData = loginReducer(action.value); break;
		case actions.SHOW_LAB_ACTION: state.labConfig = labyrinthReducer(action.value); break;
		case actions.SET_STAGE: state.stage = stageReducer(action.value); break;
		case actions.UPDATE_CODE: state.code = codeReducer(action.value); break;
	}

	return Object.assign({}, state);
}
