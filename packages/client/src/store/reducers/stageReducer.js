/**
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.token
 */
import {stages} from "../enums";

export default function (stage) {

	if (Object.values(stages).includes(stage)) {
		return stage;
	}

	return null;
};
