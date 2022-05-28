/**
 *
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.token
 */
export default function ({name, admin, sessId}) {
	if (name) {
		return {
			loggedIn: true,
			sessId,
			name,
			admin
		}
	}

	return {
		loggedIn: false
	}

};
