const { Server } = require("socket.io");
const {getUserById} = require("../user/User");
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
        const sessID = socket.handshake.query.sessId;

        getUserById(sessID).setSocket(socket);
    });
};


module.exports = {
    setupSocket
};
