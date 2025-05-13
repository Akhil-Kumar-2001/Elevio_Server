"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const userSocketMap = {};
let io = null;
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const getIO = () => io;
exports.getIO = getIO;
const configureSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] },
    });
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id, "User ID:", socket.handshake.query.userId);
        console.log("A user connected", socket.id);
        const userId = Array.isArray(socket.handshake.query.userId)
            ? socket.handshake.query.userId[0]
            : socket.handshake.query.userId;
        if (userId) {
            userSocketMap[userId] = socket.id;
            io === null || io === void 0 ? void 0 : io.emit("getOnlineUser", Object.keys(userSocketMap));
        }
        console.log("online users", userSocketMap);
        // Join a session room
        socket.on("join-session", ({ sessionId, userId, role }) => {
            socket.join(sessionId);
            console.log(`${role} ${userId} joined session ${sessionId}`);
            socket.to(sessionId).emit("user-joined", { userId, role });
        });
        // Handle WebRTC signaling messages
        socket.on("offer", ({ sessionId, offer, fromUserId }) => {
            console.log(`Offer from ${fromUserId} in session ${sessionId}`);
            socket.to(sessionId).emit("offer", { offer, fromUserId });
        });
        socket.on("answer", ({ sessionId, answer, fromUserId }) => {
            console.log(`Answer from ${fromUserId} in session ${sessionId}`);
            socket.to(sessionId).emit("answer", { answer });
        });
        socket.on("ice-candidate", ({ sessionId, candidate, fromUserId }) => {
            console.log(`ICE candidate from ${fromUserId} in session ${sessionId}`);
            socket.to(sessionId).emit("ice-candidate", { candidate });
        });
        // Handle session end
        socket.on("end-session", ({ sessionId }) => {
            console.log(`Session ${sessionId} ended`);
            socket.to(sessionId).emit("session-ended");
            socket.leave(sessionId);
        });
        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
            if (userId) {
                delete userSocketMap[userId];
                io === null || io === void 0 ? void 0 : io.emit("getOnlineUser", Object.keys(userSocketMap));
            }
        });
    });
};
exports.default = configureSocket;
