import mongoose from "mongoose";
import { Chat } from "../../../model/chat/chat.model";
import { IMessage, Message } from "../../../model/chat/message.model";
import IMessageRepository from "../IMessageRepository";

class MessageRepository implements IMessageRepository {
    async sendMessage(receiverId: string, senderId: string, message: string,imageUrl:string): Promise<IMessage | null> {
        

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
            message,
            imageUrl
        })
        console.log("new message in repo",newMessage)

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

      async deleteMessages(messagesIds: string[]): Promise<IMessage[] | []> {
        try {
          // Convert string IDs to ObjectId
          const objectIds = messagesIds.map(id => new mongoose.Types.ObjectId(id));
      
          // Perform the update
          const updatedMessages = await Message.updateMany(
            { _id: { $in: objectIds } },
            { $set: { isDeleted: true } }
          );
      
          // Optional: Return updated messages
          const softDeletedMessages = await Message.find({ _id: { $in: objectIds } });
      
          return softDeletedMessages;
        } catch (error) {
          console.error("Error in deleteMessages:", error);
          return [];
        }
      }
      
}
export default MessageRepository