import { getRooms, getChats } from "./../routes/common/util/index";
import { chat_server as io } from "../chat-server";

module.exports.chatMessage = (socket: any, data: any) => {
    const rooms = getRooms();

    const [toId] = data.to.split(':');
    const [fromId] = data.from.split(':');

    const room = rooms.find(room => (room?.users[0] == toId && room?.users[1] == fromId) ||
        (room?.users[1] == toId && room?.users[0] == fromId));
    if (room) {
        socket.join(room.roomId);
    }

    socket.on('send_message', (msg: any) => {
        const chats = getChats();
        const chat_message = {
            room: room.roomId,
            from: fromId,
            to: toId,
            msg: msg
        };

        chats.push({
            ...chat_message
        });

        io.to(room.roomId).emit("recieve_message", chat_message);
    });
}