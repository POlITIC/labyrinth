/**
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.token
 */
export default function ({name, sessId}) {
	if (name) {
		return {
			loggedIn: true,
			sessId,
			name
		}
	}

	return {
		loggedIn: false
	}

};
