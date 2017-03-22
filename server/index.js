var express = require("express"),
    path = require("path"),
    bodyParser = require("body-parser"),
    labyrinth = require("./labyrinth"),
    playerManager = require("./playerManager"),
    app = express(),
    port = 4040;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/init", function (req, res) {
    if(req.query.death){
        var labConf = labyrinth.getCurrentConfig(),
            playerPoss = playerManager.getPlayerPositions();

        labyrinth.setLevel(req.query.level);

        res.send({
            labyrinth: labConf,
            players: playerPoss,
            action: "init"
        });
    }else{
        res.send({});
    }
});

app.post("/submit", function (req, res) {
    // console.log("POST", req.body);
    playerManager.createPlayer(req.body.code, req.body.name);
    res.send({action:"submission"});
});

app.post("/update", function (req, res) {
    // console.log("POST", req.body);

    playerManager.makeMove();

    var playerPoss = playerManager.getPlayerPositions();
    res.send({
        action:"update",
        players: playerPoss
    });
});


app.set("views", "../client");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "../client")));

app.listen(port, function(err){
    if(err){
        console.log("SMTH BAD HAPPENED");
    }else{
        console.log("LISTENING", port);
    }
});


