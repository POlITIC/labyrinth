function ServerManager() {
    this.url = this.getURLParam("server") || "http://http://10.96.10.58:4040";

    console.log("URL", this.url);

    this.deathMatch = this.getURLParam("doll") === "dagabuzz";

    this.initAction(this.getURLParam("level"));

    window.serverManager = this;
};

ServerManager.prototype.getURLParam = function (name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

ServerManager.prototype.submitCode = function (submission) {
    var me = this,
        params = [],
        queryString,
        key;

    for(key in submission){
        if(submission.hasOwnProperty(key)){
            params.push(""+key+"="+submission[key]);
        }
    }

    queryString = params.join("&");

    me.req(me.url + "/submit", "POST", queryString)
};

ServerManager.prototype.getUpdate = function () {
    var me = this;

    me.req(me.url + "/update", "POST");
};

ServerManager.prototype.req = function (url, method, params) {
    var me = this,
        xhr = new XMLHttpRequest();

    xhr.open(method || 'GET', url, true);

    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState === 4) {
            me.processResponse(xhr.responseText);
        }
    };

    if(method === "POST"){
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }

    xhr.onerror = function(){
        me.handleError(xhr);
    };

    xhr.send(params);

};

ServerManager.prototype.processResponse = function (responseText) {
    // console.log("RESPONSE", responseText);
    var response = JSON.parse(responseText);
    if(response.action === "init"){
        labyrinth.setConfig(response.labyrinth);

        for(var pName in response.players){
            if(response.players.hasOwnProperty(pName)){
                var pConf = response.players[pName];

                playerManager.addPlayer(new Player(pConf.pos.left, pConf.pos.top, pConf.dir), pName);
            }
        }

        // playerManager.addPlayer(new Player)
        playerManager.updatePlayers(response.players);

        legend.init();

    }

    if(response.action === "update"){
        playerManager.updatePlayers(response.players);
        legend.update();
    }

};

ServerManager.prototype.initAction = function (level) {
    if(this.deathMatch) {
        this.req(this.url + "/init?death=true&level="+(level||0));
    }else{
        this.req(this.url + "/init");
    }

};

ServerManager.prototype.handleError = function (xhr) {
    console.error("ERROR", xhr);
};

ModuleLoader.register(ServerManager, "serverManager");