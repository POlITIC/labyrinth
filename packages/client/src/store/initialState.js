export default {
	loginData: {
		sessId: null,
		loggedIn: false,
		admin: false,
		name: null
	},
	labConfig: null,
	stage: null,
	code: "return [['MOVE_LEFT', 'MOVE_UP', 'MOVE_RIGHT', 'MOVE_DOWN'][Math.floor(Math.random() * 4)]];",
	bots: [],
	currentBot: "",
	botsSelectedToMatch: [],
	botsMatchColors: {},
	deadBots: [],
	matchStarted: false
};
