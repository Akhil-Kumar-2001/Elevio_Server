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
const statusCode_1 = require("../../../constants/statusCode");
const errorMessage_1 = require("../../../constants/errorMessage");
class MessageController {
    constructor(messageService) {
        this._messageService = messageService;
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: receiverId } = req.params;
                const { message, imageUrl } = req.body;
                const senderId = req.userId;
                const response = yield this._messageService.sendMessage(receiverId, senderId, message, imageUrl);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({
                    success: true,
                    message: 'Message sent successfully',
                    data: response,
                });
            }
            catch (error) {
                console.error('Error sending message:', error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: userToChat } = req.params;
                const senderId = req.userId;
                const response = yield this._messageService.getMessage(userToChat, senderId);
                res.status(statusCode_1.STATUS_CODES.OK).json({
                    success: true,
                    message: 'Messages retrieved successfully',
                    data: response,
                });
            }
            catch (error) {
                console.error('Error getting messages:', error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    deleteMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: receiverId } = req.params;
                const messagesIds = req.body.messageIds;
                const response = yield this._messageService.deleteMessages(receiverId, messagesIds);
                res.status(statusCode_1.STATUS_CODES.OK).json({
                    success: true,
                    message: 'Messages deleted successfully',
                    data: response,
                });
            }
            catch (error) {
                console.error('Error deleting messages:', error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
    markMessagesAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: receiverId } = req.params;
                const senderId = req.userId;
                const response = yield this._messageService.markMessagesAsRead(receiverId, senderId);
                res.status(statusCode_1.STATUS_CODES.OK).json({
                    success: true,
                    message: 'Messages marked as read',
                    data: response,
                });
            }
            catch (error) {
                console.error('Error marking messages as read:', error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
                    data: null,
                });
            }
        });
    }
}
exports.default = MessageController;
