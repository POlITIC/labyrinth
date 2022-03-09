const { Server } = require("socket.io");
let io;

const setupSocket = (http) => {
    io = new Server(http, {
        cors: {
            origin: process.env.CLIENT_DOMAIN,
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        // ...
        console.log("Connection connected");
    });
};

module.exports = {
    setupSocket
};
