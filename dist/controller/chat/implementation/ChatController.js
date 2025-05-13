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
class ChatController {
    constructor(chatService) {
        this._chatService = chatService;
    }
    getChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("controller console", req.userId);
                const { role } = req.query;
                const userId = req.userId;
                const response = yield this._chatService.getChats(userId, role);
                res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Chat retrieved successfully", data: response });
            }
            catch (error) {
                console.log("error in the controller", error);
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: receiverId } = req.params;
                const userId = req.userId;
                const response = yield this._chatService.createChat(receiverId, userId);
                res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Chat created successfully", data: response });
            }
            catch (error) {
                res.status(statusCode_1.STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: errorMessage_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
            }
        });
    }
}
exports.default = ChatController;
