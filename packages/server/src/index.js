const express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    labyrinth = require("./labyrinth"),
    playerManager = require("./math/playerManager"),
    app = express(),
    port = 4040;

const http = require('http').Server(app);

const {loginUser} = require("./data/User");
const {setupSocket} = require("./socket/socket");
const {getUserById} = require("./user/User");
const {addOrUpdateBot, getBot, getUserBots} = require("./data/Bot");

setupSocket(http);

app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_DOMAIN);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    const {sessId} = req.body;

    // TODO should only be login action the rest should send sessId
    if (!sessId) {
        next();
    } else {
        if (!getUserById(sessId)) {
            res.send({action: "logout"});
        } else {
            next();
        }
    }
});

app.post("/login", function (req, res) {
    res.send(loginUser(req.body).getClientData());
});

app.post("/labyrinth", function (req, res) {
    var labConf = labyrinth.getCurrentConfig(),
        playerPoss = playerManager.getPlayerPositions();

    labyrinth.setLevel(req.body.id);

    res.send({
        labyrinth: labConf,
        players: playerPoss,
        action: "init"
    });
});

app.post("/saveBotCode", function (req, res) {
    const {sessId, botName, code} = req.body
    const user = getUserById(sessId);
    const userId = user.model.$loki;

    addOrUpdateBot(userId, botName, code);

    console.log(getBot(userId, botName));

    res.send({action: "submission"});
});

app.post("/getBots", (req, res) => {
    const {sessId} = req.body;

    res.send(getUserBots(getUserById(sessId).model.$loki));
});

app.post("/update", function (req, res) {
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

http.listen(port, function (err) {
    if (err) {
        console.log("SMTH BAD HAPPENED");
    } else {
        console.log("LISTENING", port);
    }
});


