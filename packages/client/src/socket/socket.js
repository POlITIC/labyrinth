import { io } from "socket.io-client";

export const initSocket = () => {
    const socket = io("http://localhost:4040"); // TODO should be the same domain

    socket.on("connect", () => {
        console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
};
