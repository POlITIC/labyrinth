export default {
	loginData: {
		sessId: null,
		loggedIn: false,
		name: null
	},
	labConfig: null,
	stage: null,
	code: "return [['move_left', 'move_up', 'move_right', 'move_down'][Math.floor(Math.random() * 4)]];",
	bots: [],
	currentBot: null,
	botsSelectedToMatch: []
};
