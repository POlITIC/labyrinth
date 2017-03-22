function ModuleLoader() {
    this.modules = {};

    this.initModules();
}

ModuleLoader.prototype.addModule = function (classRef, name){
    if(classRef && typeof name == "string" && !this.modules[name]){
        this.modules[name] = new classRef();
    }else{
        throw new Error("Cannot create module with name", name);
    }
};

ModuleLoader.prototype.initModules = function(){
    var moduleRefs = ModuleLoader.moduleRefs;
    for(var name in moduleRefs){
        if(moduleRefs.hasOwnProperty(name)){
            this.addModule(ModuleLoader.moduleRefs[name], name);
        }
    }
};

ModuleLoader.register = function (classRef, name) {

    if(!this.moduleRefs){
        this.moduleRefs = {};
    }

    if(!this.moduleRefs[name] && classRef){
        this.moduleRefs[name] = classRef;
    }else{
        throw new Error("Module already registered with name", name);
    }
};

