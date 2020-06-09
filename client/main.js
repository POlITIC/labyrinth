/**
 * Entry point of everything
 */

document.addEventListener('DOMContentLoaded', function () {
    window.renderer = new Renderer();
    window.moduleLoader = new ModuleLoader();
    window.serverManager = new ServerManager();
    var playerManager = new PlayerManager();

    window.playerManager = playerManager;

    renderer.startRender();
});
