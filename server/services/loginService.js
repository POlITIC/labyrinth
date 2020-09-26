const generateLoginToken = (length = 10) => {
	const alphabet = "qazwsxedcrfvtgbyhnujmikolp1234567890";
	let result = "";

	for (let i = 0; i < length; i++) {
		const index = Math.floor(Math.random() * alphabet.length)
		result += alphabet.substr(index, 1);
	}

	return result;
};

const login = (name) => {

	if (name) {
		const token = generateLoginToken();


		// TODO check if user exists and bla bla bla
		// todo  save token

		return {
			token
		};
	}


};

module.exports = {
	login
};
