function Legend() {
    window.legend = this;
};

Legend.prototype.init = function () {
    var me = this,
        div = document.createElement("div"),
        ul = document.createElement("ul");

    this.players = playerManager.players;

    this.players.forEach(function (p) {
        if(!p.dead){
            var el = me.createPlayer(p.id, p.color);
            p.legendEl = el;
            ul.appendChild(el);
        }
    });

    div.appendChild(ul);
    document.body.appendChild(div);
};

Legend.prototype.update = function () {
    this.players.forEach(function (p) {
        if(p.dead && p.legendEl){
            p.legendEl.style.display = "none";
        }
    });
};

Legend.prototype.createPlayer = function (id, color) {
    var li = document.createElement("li");
    
    li.innerHTML = "<b>" + id + "</b>";
    li.style.color = color;

    return li;
};

ModuleLoader.register(Legend, "legend");
