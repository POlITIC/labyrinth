/**
 * Entry point of everything
 */

document.addEventListener('DOMContentLoaded', function () {
    window.renderer = new Renderer();
    window.moduleLoader = new ModuleLoader();
    window.serverManager = new ServerManager();
    var playerManager = new PlayerManager();

    window.playerManager = playerManager;

    // playerManager.addPlayer(new Player(2, 9), "vova");
    //
    // playerManager.addPlayer(new Player(15, 9), "artem");
    
    // playerManager.addPlayer(new Player(13, 28), "KoKo");

    renderer.startRender();
});
