import { createServer } from "http";
import app from "./server";
import { Server } from "socket.io";

export const http_server = createServer(app);
export const chat_server = new Server(http_server);

chat_server.on("connection", (socket) => {
    console.log("socket.id", socket.id);
    console.log(socket.handshake?.auth);
    require("./routes/UserSockets").chatMessage(socket, socket.handshake?.auth);
});