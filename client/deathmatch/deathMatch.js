document.addEventListener("DOMContentLoaded", function () {
	var selectorParent = document.getElementById("addPlayers_parent");
	var playerSelect0 = document.getElementById("playerSelect_0");
	var addPlayerButton = document.getElementById("addPlayer_button");
	var startButton = document.getElementById("startMatch_button");
	var amountOfPlayers = 1;

	var playerSelects = [playerSelect0];

	var getAvailableValues = function () {
		var result = [];
		for (var i = 0; i < playerSelect0.children.length; i++) {
			var option = playerSelect0.children[i];
			result.push(option.value);
		}

		return result;
	};

	var availableValues = getAvailableValues();

	window.SELECT = playerSelect0;

	/**
	 *
	 * @param {number} index
	 */
	var getSelectedValue = function (index) {
		var playerSelect = document.getElementById("playerSelect_" + index);
		return playerSelect.value;
	};

	var removePlayer = function (index) {

	};

	var addPlayer = function () {
		var player = new PlayerSelector(selectorParent, amountOfPlayers++, availableValues)
		playerSelects.push(player.select);
	};

	addPlayerButton.addEventListener("click", addPlayer);

});


