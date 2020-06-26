var parentId = "addPlayers_parent";
var index = 0;
var PlayerSelector = function (allSelectors, playerNames, removeCallback) {
	this.parent = document.getElementById(parentId);
	this.playerNames = playerNames;
	this.index = index++;
	this.allSelectors =allSelectors;
	this.removeCallback = removeCallback;

	this.init();
};

PlayerSelector.prototype.init = function () {
	var me = this;
	var container = document.createElement("div");
	container.innerText = "Add Player " + this.index + " :";
	container.classList.add("jumbotron");
	this.container = container;

	var select = document.createElement("select");
	select.id = "playerSelect_" + this.index;
	container.appendChild(select);
	this.select = select;

	this.playerNames.forEach(function (name) {
		var option = document.createElement("option");
		option.innerText = name;

		select.appendChild(option);
	});

	this.removeButton = document.createElement("button");
	this.removeButton.id= "removePlayer_button_"+ this.index;
	this.removeButton.innerText = "X";
	container.appendChild(this.removeButton);

	this.removeButton.addEventListener("click", function () {
		const index = me.allSelectors.indexOf(me);
		if(index > -1 && me.allSelectors.length > 1){
			me.allSelectors.splice(index, 1);
			me.parent.removeChild(me.container);
		}
	});

	this.parent.appendChild(container);
};
PlayerSelector.prototype.getValue = function () {
	return this.select.value;
};
