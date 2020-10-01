const saveBot = (name, codeString) => {
	return new Promise((resolve, reject) => {
		console.log("BOT", name, codeString);

		setTimeout(() => {
			resolve("sucksAss");
		}, 1000);

	});
};

module.exports = {saveBot};
