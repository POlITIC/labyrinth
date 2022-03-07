/**
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.token
 */
export default function ({name}) {

	if (name) {
		return {
			loggedIn: true,
			name
		}
	}

	return {
		loggedIn: false
	}

};
