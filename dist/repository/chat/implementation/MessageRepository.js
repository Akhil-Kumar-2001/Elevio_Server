"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chat_model_1 = require("../../../model/chat/chat.model");
const message_model_1 = require("../../../model/chat/message.model");
const socketConfig_1 = require("../../../Config/socketConfig");
class MessageRepository {
    sendMessage(receiverId, senderId, message, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let chat = yield chat_model_1.Chat.findOne({
                participants: { $all: [senderId, receiverId] },
            });
            if (!chat) {
                chat = yield chat_model_1.Chat.create({
                    participants: [senderId, receiverId],
                });
            }
            const newMessage = new message_model_1.Message({
                senderId,
                receiverId,
                message,
                imageUrl,
                isRead: false,
            });
            if (newMessage) {
                chat.messages.push(newMessage._id);
                chat.lastMessage = message || (imageUrl ? '[Image]' : '');
                chat.updatedAt = new Date();
            }
            yield Promise.all([chat.save(), newMessage.save()]);
            return newMessage;
        });
    }
    getMessage(userToChat, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const chat = yield chat_model_1.Chat.findOne({
                participants: { $all: [senderId, userToChat] },
            }).populate('messages');
            return chat ? chat.messages : [];
        });
    }
    deleteMessages(messagesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectIds = messagesIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
                const updatedMessages = yield message_model_1.Message.updateMany({ _id: { $in: objectIds } }, { $set: { isDeleted: true } });
                const softDeletedMessages = yield message_model_1.Message.find({ _id: { $in: objectIds } });
                return softDeletedMessages;
            }
            catch (error) {
                console.error('Error in deleteMessages:', error);
                return [];
            }
        });
    }
    markMessagesAsRead(receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield message_model_1.Message.updateMany({
                    senderId: receiverId, // Messages sent by the other user
                    receiverId: senderId, // Received by the current user
                    isRead: false,
                    isDeleted: { $ne: true },
                }, { $set: { isRead: true } });
                // Emit Socket.IO event to notify the sender
                const io = (0, socketConfig_1.getIO)();
                const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(receiverId);
                if (io && receiverSocketId) {
                    io.to(receiverSocketId).emit('messagesRead', {
                        senderId,
                        receiverId,
                        unreadCount: 0, // Notify that unread count is now 0
                    });
                }
                return result.modifiedCount > 0;
            }
            catch (error) {
                console.error('Error marking messages as read:', error);
                return null;
            }
        });
    }
}
exports.default = MessageRepository;
