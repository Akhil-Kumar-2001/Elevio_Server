import { Server } from "socket.io";
import { Server as HttpServer } from 'http';

const userSocketMap: { [key: string]: string } = {};

let io: Server | null = null;

export const getReceiverSocketId = (receiverId: string) => {
    return userSocketMap[receiverId];
};

export const getIO = () => io;

const configureSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: { origin: "*", methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] },
    });

    io.on('connection', (socket) => {
        console.log("a user connected", socket.id);

        const userId = Array.isArray(socket.handshake.query.userId)
            ? socket.handshake.query.userId[0]
            : socket.handshake.query.userId;

        if (userId) {
            userSocketMap[userId] = socket.id;
        }

        console.log('online users', userSocketMap);
        if(io){
            io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
        socket.on('disconnect', () => {
            console.log("user is disconnected", socket.id);
            if (userId && io) {
                delete userSocketMap[userId];
                io.emit("getOnlineUser", Object.keys(userSocketMap));
            }
        });
    });
};

export default configureSocket;

