import { Chat, IChat } from "../../../model/chat/chat.model"; // update this path as needed
import { Student } from "../../../model/student/studentModel";
import { Tutor } from "../../../model/tutor/tutorModel";
import { UserMinimal } from "../../../Types/basicTypes";
import IChatRepository from "../IChatRepository";
import mongoose from "mongoose";

class ChatRepository implements IChatRepository {
    async getChats(userId: string, role: string): Promise<UserMinimal[] | null> {
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Step 1: Find all chats containing the current user
        const chats = await Chat.find({ participants: userObjectId }).select("participants");

        if (!chats.length) return [];

        // Step 2: Collect other participant IDs
        const otherUserIds: string[] = [];

        for (const chat of chats) {
            for (const participantId of chat.participants) {
                if (!participantId.equals(userObjectId)) {
                    otherUserIds.push(participantId.toString());
                }
            }
        }

        // Step 3: Fetch the other user info based on their role
        if (role === "Tutor") {
            const students = await Student.find({ _id: { $in: otherUserIds } })
                .select("_id username profilePicture role")
                .lean();

            return students.map((s) => ({
                _id: s._id.toString(),
                username: s.username ?? "",
                profilePicture: s.profilePicture,
                role: "Student",
            }));
        } else if (role === "Student") {
            const tutors = await Tutor.find({ _id: { $in: otherUserIds } })
                .select("_id username role profile.profilePicture")
                .lean();

            return tutors.map((t) => ({
                _id: t._id.toString(),
                username: t.username,
                profilePicture: t.profile?.profilePicture,
                role: "Tutor",
            }));
        }

        return null;
    }

    async createChat(receiverId: string, userId: string): Promise<IChat | null> {
        try {
            // Step 1: Check if chat already exists
            const existingChat = await Chat.findOne({
                participants: { $all: [userId, receiverId], $size: 2 },
            });
    
            if (existingChat) {
                return existingChat;
            }
    
            // Step 2: Create a new chat
            const newChat = await Chat.create({
                participants: [userId, receiverId],
            });
    
            return newChat;
        } catch (error) {
            return null;
        }
    }
    
}

export default ChatRepository;
