const SERVER_URL = "http://localhost:4040";

const METHODS = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT"
};

const request = (method, data, url) => {
	return new Promise((resolve, reject) => {
		fetch(SERVER_URL + url, {
			method: method,
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		}).then((response) => {
			if (response.status >= 200 && response.status < 300 && response.ok) {
				resolve(response.json());
			} else {
				console.error("POST failed", response);
				reject(resolve);
			}
		});
	});
};

/**
 *
 * @param {Object} data
 * @param {string} url
 * @return {Promise<Response>}
 */
const post = (data, url) => {
	return request(METHODS.POST, data, url);
};

export const login = (name) => {
	return post({name}, "/login");
};


/**
 * @param {string} id
 */
export const getLabyrinth = (id) => {
	return post({id}, "/labyrinth")
};


export const submitCode = (botName, codeString) => {
	return post({botName, codeString}, "/saveBotCode");
};
