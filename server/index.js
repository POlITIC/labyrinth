var express = require("express"),
	path = require("path"),
	bodyParser = require("body-parser"),
	playerManager = require("./playerManager"),
	userManager = require("./userManager"),
	{login} = require("./services/loginService.js"),
	labService = require("./services/labyrinthService.js"),
	{saveBot} = require("./services/botService"),
	app = express(),
	port = 4040;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
	next();
});

app.get("/", function (req, res) {
	res.render("login/login");
});

app.post("/login", function (req, res) {
	const name = req.body.name;
	const loginResult = login(name);

	if (loginResult) {
		res.send(loginResult);
	} else {
		res.status(500).send('Login Failed');
	}
});

app.post("/labyrinth", (req, res) => {
	const id = req.body.id;

	const labConf = labService.getById(id);

	if (labConf) {
		res.send({
			config: labConf
		});
	} else {
		res.status(404).send('Labyrinth not found');
	}

});

app.post("/saveBotCode", (req, res) => {
	saveBot(req.body.botName, req.body.codeString).then((result) => {
		res.send({result});
	});
});


// legacy
app.get("/index", (req, res) => {
	res.render("index");
});

app.get("/deathmatch", function (req, res) {
	const name = req.query.name;
	if (!name) {
		res.render("login/login");
	} else {
		res.render("deathmatch/deathmatch", {players: playerManager.getUserPlayers(name)});
	}
});

app.get("/init", function (req, res) {

	var name = req.query.name;

	var user = userManager.getOrCreateUser(name);

	res.send({
		labyrinth: user.labyrinth.getCurrentConfig(),
		players: user.players,
		action: "init"
	});

	// if (req.query.death) {
	//     var labConf = labyrinth.getCurrentConfig(),
	//         playerPoss = playerManager.getPlayerPositions();
	//
	//     labyrinth.setLevel(req.query.level);
	//
	//     res.send({
	//         labyrinth: labConf,
	//         players: playerPoss,
	//         action: "init"
	//     });
	// } else {
	//     res.send({});
	// }
});

app.post("/submit", function (req, res) {
	playerManager.createPlayer(req.body.code, req.body.name, req.body.user);

	res.send({action: "submission"});
});

app.post("/test", function (req, res) {
	var userName = req.body.name,
		codeString = req.body.code,
		user = userManager.getOrCreateUser(userName);

	user.addCode(codeString);

	res.send({});
});

app.get("/playersList", function (req, res) {

});

app.post("/choosePlayers", function (req, res) {

});


app.post("/update", function (req, res) {
	// console.log("POST", req.body);

	playerManager.makeMove();

	var playerPoss = playerManager.getPlayerPositions();
	res.send({
		action: "update",
		players: playerPoss
	});
});


app.set("views", "../client");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../client")));

app.listen(port, function (err) {
	if (err) {
		console.log("SMTH BAD HAPPENED");
	} else {
		console.log("LISTENING", port);
	}
});


