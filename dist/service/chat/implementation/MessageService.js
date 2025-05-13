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
Object.defineProperty(exports, "__esModule", { value: true });
const socketConfig_1 = require("../../../Config/socketConfig");
class MessageService {
    constructor(chatRepository) {
        this._messageRepository = chatRepository;
    }
    sendMessage(receiverId, senderId, message, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._messageRepository.sendMessage(receiverId, senderId, message, imageUrl);
            const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(receiverId);
            const io = (0, socketConfig_1.getIO)();
            if (receiverSocketId && io) {
                io.to(receiverSocketId).emit("newMessage", response);
            }
            return response;
        });
    }
    getMessage(userToChat, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._messageRepository.getMessage(userToChat, senderId);
            return response;
        });
    }
    deleteMessages(receiverId, messagesIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._messageRepository.deleteMessages(messagesIds);
            const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(receiverId);
            const io = (0, socketConfig_1.getIO)();
            if (receiverSocketId && io) {
                io.to(receiverSocketId).emit('deleteMessage', response);
            }
            return response;
        });
    }
    markMessagesAsRead(receiverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._messageRepository.markMessagesAsRead(receiverId, senderId);
                return response;
            }
            catch (error) {
                console.error('Error in markMessagesAsRead service:', error);
                return null;
            }
        });
    }
}
exports.default = MessageService;
