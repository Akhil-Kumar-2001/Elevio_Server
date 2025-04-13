// import { Chat, IChat } from "../../../model/chat/chat.model"; // update this path as needed
// import { Message } from "../../../model/chat/message.model";
// import { Student } from "../../../model/student/studentModel";
// import { Tutor } from "../../../model/tutor/tutorModel";
// import { UserMinimal } from "../../../Types/basicTypes";
// import IChatRepository from "../IChatRepository";
// import mongoose, { Types } from "mongoose";

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


import { Chat, IChat } from '../../../model/chat/chat.model';
import { Message } from '../../../model/chat/message.model';
import { Student } from '../../../model/student/studentModel';
import { Tutor } from '../../../model/tutor/tutorModel';
import { UserMinimal } from '../../../Types/basicTypes';
import IChatRepository from '../IChatRepository';
import mongoose, { Types } from 'mongoose';

class ChatRepository implements IChatRepository {
  async getChats(userId: string, role: string): Promise<UserMinimal[] | null> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Find all chats containing the current user
      const chats = await Chat.find({ participants: userObjectId })
        .sort({ updatedAt: -1 })
        .select('participants lastMessage updatedAt')
        .lean();

      if (!chats.length) return [];

      const otherUserData: UserMinimal[] = [];

      for (const chat of chats) {
        const otherParticipant = chat.participants.find(
          (id: Types.ObjectId) => !id.equals(userObjectId)
        );

        if (!otherParticipant) continue;

        const otherUserId = otherParticipant.toString();

        // Calculate unread messages
        const unreadCount = await Message.countDocuments({
          senderId: otherUserId,
          receiverId: userId,
          isRead: false,
          isDeleted: { $ne: true },
        });

        if (role === 'Tutor') {
          const student = await Student.findById(otherUserId)
            .select('_id username profilePicture role')
            .lean();

          if (student) {
            otherUserData.push({
              _id: student._id.toString(),
              username: student.username ?? '',
              profilePicture: student.profilePicture,
              role: 'Student',
              lastMessage: chat.lastMessage || '',
              unreadCount,
              updatedAt: chat.updatedAt?.toISOString(),
            });
          }
        } else if (role === 'Student') {
          const tutor = await Tutor.findById(otherUserId)
            .select('_id username role profile.profilePicture')
            .lean();

          if (tutor) {
            otherUserData.push({
              _id: tutor._id.toString(),
              username: tutor.username,
              profilePicture: tutor.profile?.profilePicture,
              role: 'Tutor',
              lastMessage: chat.lastMessage || '',
              unreadCount,
              updatedAt: chat.updatedAt?.toISOString(),
            });
          }
        }
      }

      return otherUserData;
    } catch (error) {
      console.error('Error fetching chats:', error);
      return null;
    }
  }

  async createChat(receiverId: string, userId: string): Promise<IChat | null> {
    try {
      const existingChat = await Chat.findOne({
        participants: { $all: [userId, receiverId], $size: 2 },
      });

      if (existingChat) {
        return existingChat;
      }

      const newChat = await Chat.create({
        participants: [userId, receiverId],
      });

      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      return null;
    }
  }
}

export default ChatRepository;