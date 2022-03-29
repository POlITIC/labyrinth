export default {
	loginData: {
		sessId: null,
		loggedIn: false,
		name: null
	},
	labConfig: null,
	stage: null,
	code: "return [['MOVE_LEFT', 'MOVE_UP', 'MOVE_RIGHT', 'MOVE_DOWN'][Math.floor(Math.random() * 4)]];",
	bots: [],
	currentBot: null,
	botsSelectedToMatch: [],
	botsMatchColors: {},
	matchStarted: false
};
