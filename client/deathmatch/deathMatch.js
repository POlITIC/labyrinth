document.addEventListener("DOMContentLoaded", function () {
	var addPlayerButton = document.getElementById("addPlayer_button");
	var startButton = document.getElementById("startMatch_button");
	var backButton = document.getElementById("back_button");
	var parentEl = document.getElementById("addPlayers_parent");
	let avPlayerNames, selectors = [];

	const createPlayerSelector = function () {
		var player = new PlayerSelector(selectors, avPlayerNames);
		selectors.push(player);
	};


	const getAvailableValues = function () {
		const elements = parentEl.getElementsByClassName("names_arr_elem");
		const namesArr = [];

		console.log(elements);

		for (let i = 0; i < elements.length; i++) {
			let elem = elements[i];
			namesArr.push(elem.innerText);
		}

		while (elements[0]) {
			elements[0].parentNode.removeChild(elements[0]);
		}

		return namesArr;
	};
	avPlayerNames = getAvailableValues();

	createPlayerSelector();

	var addPlayer = function () {
		createPlayerSelector();
	};

	addPlayerButton.addEventListener("click", addPlayer);
	backButton.addEventListener("click", function () {
		window.location.href = "./login";
	});

	startButton.addEventListener("click", function () {
		var selectedNames = selectors.map(function (sel) {
			return sel.getValue();
		});

	});

});


