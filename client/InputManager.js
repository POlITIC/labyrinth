function InputManager() {
    this.init();
}

InputManager.prototype.init = function () {

    this.userName = serverManager.name;
    this.initNameField();
    this.initDiv();
    this.initCodeMirror(this.wrapperEl);
    this.initButtons();
    this.initSelector();
    this.initFileSelector()
};


InputManager.prototype.readTextFile = function(file) {
        var me = this,
            reader = new FileReader();

        reader.onload = function(){
            var text = reader.result;
            me.codeMirror.doc.setValue(text);
        };
        reader.readAsText(file);
};


InputManager.prototype.initFileSelector = function () {
    var me = this,
        fileSelector = document.getElementById("initFileSelector");

    fileSelector.onchange = function (e) {
        var file = fileSelector.files[0];

        if(file){
            me.readTextFile(file);
        }
    }


};

InputManager.prototype.initSelector = function () {
  var typeSelector = document.getElementById("testType");

    typeSelector.getValue = function () {
        return this.options[this.selectedIndex].value;
    };

    this.typeSelector = typeSelector;
};

InputManager.prototype.initNameField = function () {
    var nameInput = document.getElementById("name");

    nameInput.value = this.userName;

    this.nameInput = nameInput;
};

InputManager.prototype.initDiv = function () {
    var div = document.createElement("div");

    div.id = "input";
    document.body.appendChild(div);

    this.wrapperEl = div;
};

InputManager.prototype.initCodeMirror = function (div) {
    this.codeMirror = CodeMirror(div, {
        value: "return ['left', 'up', 'right', 'down'][Math.floor(Math.random() * 4)];",
        smartIndent: true,
        mode:  "javascript"
    });

};

InputManager.prototype.initButtons = function () {
    var me = this,
        testButton = document.getElementById("restartButton"),
        submitButton = document.getElementById("submitButton");

    testButton.onclick = function(e){

        me.test({
            code: serverManager.deathMatch ? encodeURIComponent(me.getCodeString()) : me.getCodeString()
        });
    };
    submitButton.onclick = function(e){

        if(me.nameInput.value !== ""){
            me.submit({
                name: me.nameInput.value,
                code: encodeURIComponent(me.getCodeString())
            });
        }else{
            console.error("Name field is empty!");
        }
    };
};

InputManager.prototype.getCodeString = function () {
    var code = this.codeMirror.doc.getValue();

    var header = "(function move(data, savedData){ \nvar window = null, document = null;\n",
        footer = "})";

    return header + code + footer;
};

InputManager.prototype.test = function (codeObj) {
    var func = eval(codeObj.code);

    playerManager.addPlayerCallback(func, "testUser");
    serverManager.sendToTest(codeObj);

    clock.start();
};

InputManager.prototype.submit = function (submission) {
    serverManager.submitCode(submission);
};

ModuleLoader.register(InputManager, "inputManager");
