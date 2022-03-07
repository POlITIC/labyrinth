const { Server } = require("socket.io");
let io;

const setupSocket = (http) => {
    io = new Server(http, {/* options */ });

    io.on("connection", (socket) => {
        // ...
        console.log("Connection", socket);
    });

};

module.exports = {
    setupSocket
};
