function InputManager() {
    this.init();
}

InputManager.prototype.init = function () {
    this.initNameField();
    this.initDiv();
    this.initCodeMirror(this.wrapperEl);
    this.initButtons();
};

InputManager.prototype.initNameField = function () {
    var nameInput = document.createElement("input"),
        nameLabel = document.createElement("label");


    nameLabel.for = "name";
    nameLabel.innerText = "Name: ";
    
    nameInput.type = "text";
    nameInput.id = "name";

    document.body.appendChild(nameLabel);
    document.body.appendChild(nameInput);

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
        value: "return 'right';",
        smartIndent: true,
        mode:  "javascript"
    });

};

InputManager.prototype.initButtons = function () {
    var me = this,
        div = document.createElement("div"),
        testButton = document.createElement("input"),
        submitButton = document.createElement("input");

    div.id = "buttons";

    testButton.type = "button";
    testButton.value = "Test";
    testButton.onclick = function(e){
        console.log("TEST BUTTON CLICKED");
        var code = me.getCodeString();

        me.test(code);
    };
    div.appendChild(testButton);

    submitButton.type = "button";
    submitButton.value = "Submit";
    submitButton.onclick = function(e){
        if(me.nameInput.value !== ""){
            me.submit({
                name: me.nameInput.value,
                code: me.getCodeString()
            });
        }else{
            console.error("Name field is empty!");
        }
    };
    div.appendChild(submitButton);

    document.body.appendChild(div);
};

InputManager.prototype.getCodeString = function () {
    var code = this.codeMirror.doc.getValue();

    var header = "var fun = (function move(data, savedData){ \nvar window = null, document = null;\n",
        footer = "})";

    return header + code + footer;
};

InputManager.prototype.test = function (code) {
    var func = eval(code);

    playerManager.addPlayerCallback(func, "testUser");
    clock.start();
};

InputManager.prototype.submit = function (submission) {
    serverManager.submitCode(submission);
};

ModuleLoader.register(InputManager, "inputManager");