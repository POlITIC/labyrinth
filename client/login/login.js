document.addEventListener("DOMContentLoaded",function () {
    var nameInput = document.getElementById("name_input");
    var createButton = document.getElementById("test_button");
    var deathMatchButton = document.getElementById("deathMatch_button");

    function submit(page) {
        var name = nameInput.value;

        window.location.href ="./" +  page + "?name=" + name;
    }

    createButton.onclick = submit.bind(this, "index");
    deathMatchButton.onclick = submit.bind(this, "deathmatch");
});


