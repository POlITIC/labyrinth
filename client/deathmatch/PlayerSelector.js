var PlayerSelector = function (parent, index, playerNames) {
	this.parent = parent;
	this.index = index;
	this.playerNames = playerNames;

	this.init();
};

PlayerSelector.prototype.init = function () {
	var container = document.createElement("div");
	container.innerText = "Add Player " + this.index + " :";

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
	this.removeButton.id= "removePlayer_bytton_"+ this.index;
	this.removeButton.innerText = "X";
	container.appendChild(this.removeButton);

	this.parent.appendChild(container);
};
