"use strict";
// import { Chat, IChat } from "../../../model/chat/chat.model"; // update this path as needed
// import { Message } from "../../../model/chat/message.model";
// import { Student } from "../../../model/student/studentModel";
// import { Tutor } from "../../../model/tutor/tutorModel";
// import { UserMinimal } from "../../../Types/basicTypes";
// import IChatRepository from "../IChatRepository";
// import mongoose, { Types } from "mongoose";
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
// class ChatRepository implements IChatRepository {
//     async getChats(userId: string, role: string): Promise<UserMinimal[] | null> {
//         const userObjectId = new mongoose.Types.ObjectId(userId);
//         // Step 1: Find all chats containing the current user
//         const chats = await Chat.find({ participants: userObjectId })
//         .sort({ updatedAt: -1 })
//         .select("participants lastMessage")
//         .lean();
//         if (!chats.length) return [];
//         const otherUserData: UserMinimal[] = [];
//         for (const chat of chats) {
//             const otherParticipant = chat.participants.find((id: Types.ObjectId) => !id.equals(userObjectId));
//             if (!otherParticipant) continue;
//             const otherUserId = otherParticipant.toString();
//             const unreadCount = await Message.countDocuments({
//                 chatId: chat._id,
//                 receiverId: userObjectId,
//                 isRead: false,
//                 isDeleted: { $ne: true },
//               });
//             if (role === "Tutor") {
//                 const student = await Student.findById(otherUserId)
//                     .select("_id username profilePicture role")
//                     .lean();
//                 if (student) {
//                     otherUserData.push({
//                         _id: student._id.toString(),
//                         username: student.username ?? "",
//                         profilePicture: student.profilePicture,
//                         role: "Student",
//                         lastMessage: chat.lastMessage || "", 
//                         unreadCount,
//                     });
//                 }
//             } else if (role === "Student") {
//                 const tutor = await Tutor.findById(otherUserId)
//                     .select("_id username role profile.profilePicture")
//                     .lean();
//                 if (tutor) {
//                     otherUserData.push({
//                         _id: tutor._id.toString(),
//                         username: tutor.username,
//                         profilePicture: tutor.profile?.profilePicture,
//                         role: "Tutor",
//                         lastMessage: chat.lastMessage || "",
//                         unreadCount,
//                     });
//                 }
//             }
//         }
//         return otherUserData;
//     }
//     async createChat(receiverId: string, userId: string): Promise<IChat | null> {
//         try {
//             // Step 1: Check if chat already exists
//             const existingChat = await Chat.findOne({
//                 participants: { $all: [userId, receiverId], $size: 2 },
//             });
//             if (existingChat) {
//                 return existingChat;
//             }
//             // Step 2: Create a new chat
//             const newChat = await Chat.create({
//                 participants: [userId, receiverId],
//             });
//             return newChat;
//         } catch (error) {
//             return null;
//         }
//     }
// }
// export default ChatRepository;
const chat_model_1 = require("../../../model/chat/chat.model");
const message_model_1 = require("../../../model/chat/message.model");
const studentModel_1 = require("../../../model/student/studentModel");
const tutorModel_1 = require("../../../model/tutor/tutorModel");
const mongoose_1 = __importDefault(require("mongoose"));
class ChatRepository {
    getChats(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                // Find all chats containing the current user
                const chats = yield chat_model_1.Chat.find({ participants: userObjectId })
                    .sort({ updatedAt: -1 })
                    .select('participants lastMessage updatedAt')
                    .lean();
                if (!chats.length)
                    return [];
                const otherUserData = [];
                for (const chat of chats) {
                    const otherParticipant = chat.participants.find((id) => !id.equals(userObjectId));
                    if (!otherParticipant)
                        continue;
                    const otherUserId = otherParticipant.toString();
                    // Calculate unread messages
                    const unreadCount = yield message_model_1.Message.countDocuments({
                        senderId: otherUserId,
                        receiverId: userId,
                        isRead: false,
                        isDeleted: { $ne: true },
                    });
                    if (role === 'Tutor') {
                        const student = yield studentModel_1.Student.findById(otherUserId)
                            .select('_id username profilePicture role')
                            .lean();
                        if (student) {
                            otherUserData.push({
                                _id: student._id.toString(),
                                username: (_a = student.username) !== null && _a !== void 0 ? _a : '',
                                profilePicture: student.profilePicture,
                                role: 'Student',
                                lastMessage: chat.lastMessage || '',
                                unreadCount,
                                updatedAt: (_b = chat.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
                            });
                        }
                    }
                    else if (role === 'Student') {
                        const tutor = yield tutorModel_1.Tutor.findById(otherUserId)
                            .select('_id username role profile.profilePicture')
                            .lean();
                        if (tutor) {
                            otherUserData.push({
                                _id: tutor._id.toString(),
                                username: tutor.username,
                                profilePicture: (_c = tutor.profile) === null || _c === void 0 ? void 0 : _c.profilePicture,
                                role: 'Tutor',
                                lastMessage: chat.lastMessage || '',
                                unreadCount,
                                updatedAt: (_d = chat.updatedAt) === null || _d === void 0 ? void 0 : _d.toISOString(),
                            });
                        }
                    }
                }
                return otherUserData;
            }
            catch (error) {
                console.error('Error fetching chats:', error);
                return null;
            }
        });
    }
    createChat(receiverId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingChat = yield chat_model_1.Chat.findOne({
                    participants: { $all: [userId, receiverId], $size: 2 },
                });
                if (existingChat) {
                    return existingChat;
                }
                const newChat = yield chat_model_1.Chat.create({
                    participants: [userId, receiverId],
                });
                return newChat;
            }
            catch (error) {
                console.error('Error creating chat:', error);
                return null;
            }
        });
    }
}
exports.default = ChatRepository;
