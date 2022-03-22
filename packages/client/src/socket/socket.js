import { io } from "socket.io-client";
import store from "../store/store";

let socket = null;

export const initSocket = () => {
    return new Promise ((resolve, reject) => {
        socket = io("http://localhost:4040", {
            query: {
                sessId: store.getState().loginData.sessId
            }
        }); // TODO should be the same domain

        socket.on("connect", () => {
            console.log(socket.id);
            resolve();
        });
    });
};

export const getSocket = () => {
    if(!socket){
        throw new Error("Socket is not ready yet!!!");
    }

    return socket;
};
