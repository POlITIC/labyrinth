function ServerManager() {
    this.url = this.getURLParam("server") || "http://localhost:4040";

    this.name = this.getURLParam("name");

    this.initAction(this.name);

    this.log = [];
};

ServerManager.prototype.getURLParam = function (name, url) {
    url = url || window.location.href;

    name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);


    if (!results) return null;

    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

ServerManager.prototype.submitCode = function (submission) {
    var me = this,
        queryString;

    if(!submission.name){
        submission.name = me.name;
    }

    queryString = me.objToQuesryString(submission);

    me.req(me.url + "/submit", "POST", queryString);
};

ServerManager.prototype.sendToTest = function (codeObj) {
    var me = this,
        queryString;

    if(!codeObj.name){
        codeObj.name = me.name;
    }

    queryString = me.objToQuesryString(codeObj);

    me.req(me.url + "/test", "POST", queryString);
};

ServerManager.prototype.objToQuesryString = function (obj) {
    var params = [],
        key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            params.push("" + key + "=" + obj[key]);
        }
    }

    return params.join("&");
};

ServerManager.prototype.getUpdate = function () {
    var me = this;

    me.req(me.url + "/update", "POST");
};

ServerManager.prototype.req = function (url, method, params) {
    var me = this,
        xhr = new XMLHttpRequest();

    params = params || {};
    params.name = this.name;

    if (method === "GET" && typeof params === "object") {
        url += "?" + this.objToQuesryString(params);
    }

    xhr.open(method || 'GET', url, true);

    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState === 4) {
            me.processResponse(xhr.responseText);
        }
    };

    if (method === "POST") {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    }

    xhr.onerror = function () {
        me.handleError(xhr);
    };

    xhr.send(params);

};

ServerManager.prototype.processResponse = function (responseText) {
    var response = JSON.parse(responseText),
        pName;

    if (response.action === "init") {

        moduleLoader.initModules();

        labyrinth.setConfig(response.labyrinth);

        for (pName in response.players) {
            if (response.players.hasOwnProperty(pName)) {
                var pConf = response.players[pName];

                playerManager.addPlayer(new Player(pConf.pos.left, pConf.pos.top, pConf.dir), pName);
            }
        }

        // playerManager.addPlayer(new Player)
        playerManager.updatePlayers(response.players);
        this.log.push(response.players);

        legend.init();
    }

    if (response.action === "update") {
        playerManager.updatePlayers(response.players);
        legend.update();
        this.log.push(response.players);
    }

};

ServerManager.prototype.initAction = function (name) {
    // if(this.deathMatch) {
    //     this.req(this.url + "/init?death=true&level="+(level||0));
    // }else{
    //     this.req(this.url + "/init");
    // }

    this.req(this.url + "/init", "GET");

};

ServerManager.prototype.handleError = function (xhr) {
    console.error("ERROR", xhr);
};
