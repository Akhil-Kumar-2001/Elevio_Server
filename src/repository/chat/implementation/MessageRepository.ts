import mongoose from "mongoose";
import { Chat } from "../../../model/chat/chat.model";
import { IMessage, Message } from "../../../model/chat/message.model";
import IMessageRepository from "../IMessageRepository";

class MessageRepository implements IMessageRepository {
    async sendMessage(receiverId: string, senderId: string, message: string): Promise<IMessage | null> {
        // const participantIds = [id, senderId].sort().join("_");

        // const chat = await Chat.findOne({ participantIds });
        // console.log("find the chat from the repository",chat)

        // return true

        let chat = await Chat.findOne({
            participants:{$all:[senderId,receiverId]}
        })
        if(!chat){
            chat = await Chat.create({
                participants:[senderId,receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if(newMessage){
            chat.messages.push(newMessage._id as mongoose.Types.ObjectId)
        }

        await Promise.all([chat.save(),newMessage.save()]);

        return newMessage;
    }

    async getMessage(userToChat: string, senderId: string): Promise<IMessage[] | []> {
        const chat = await Chat.findOne({
          participants: { $all: [senderId, userToChat] }
        }).populate<{ messages: IMessage[] }>("messages");
      
        return chat ? chat.messages : [];
      }
      
}
export default MessageRepository