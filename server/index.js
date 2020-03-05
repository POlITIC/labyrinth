var express = require("express"),
	path = require("path"),
	bodyParser = require("body-parser"),
	labyrinth = require("./labyrinth"),
	playerManager = require("./playerManager"),
	userManager = require("./userManager"),
	app = express(),
	port = 4040;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
	// if(req.query.test){
	//     // Set to test mode
	// }
	// else {
	//     if(req.query.deathMatch){
	//         // set to deathMatch mode
	//     }
	// }

	res.render("login/login");
});

app.get("/login", function (req, res) {
	var name = req.query.name;

	if (!name) {
		res.render("login/login");
	} else {
		res.render("index");
	}

});

app.get("/init", function (req, res) {

	var name = req.query.name;

	var user = userManager.getOrCreateUser(name);

	console.log("USER", user);

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
	// console.log("POST", req.body);
	playerManager.createPlayer(req.body.code, req.body.name);
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


