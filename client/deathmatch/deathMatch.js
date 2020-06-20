document.addEventListener("DOMContentLoaded",function () {
    var playerSelect0 = document.getElementById("playerSelect_0");
    var addPlayerButton = document.getElementById("addPlayer_button");
    var startButton = document.getElementById("startMatch_button");
    var amountOfPlayers = 1;

    var availableValues = playerSelect0.children.map(function (option) {
        return option.value;
    })

    window.SELECT = playerSelect0;

    /**
     *
     * @param {number} index
     */
    var getSelectedValue = function (index) {
        var playerSelect = document.getElementById("playerSelect_" + index);
        return playerSelect.value;
    };

    var addPlayer = function () {

    };

});


