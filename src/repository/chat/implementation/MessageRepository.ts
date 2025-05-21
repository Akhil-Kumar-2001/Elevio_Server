

import mongoose from 'mongoose';
import { Chat } from '../../../model/chat/chat.model';
import { IMessage, Message } from '../../../model/chat/message.model';
import IMessageRepository from '../IMessageRepository';
import { getIO, getReceiverSocketId } from '../../../Config/socketConfig';

class MessageRepository implements IMessageRepository {
  async sendMessage(receiverId: string, senderId: string, message: string, imageUrl: string): Promise<IMessage | null> {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      imageUrl,
      isRead: false,
    });

    if (newMessage) {
      chat.messages.push(newMessage._id as mongoose.Types.ObjectId);
      chat.lastMessage = message || (imageUrl ? '[Image]' : '');
      chat.updatedAt = new Date();
    }

    await Promise.all([chat.save(), newMessage.save()]);

    return newMessage;
  }

  async getMessage(userToChat: string, senderId: string): Promise<IMessage[] | []> {
    const chat = await Chat.findOne({
      participants: { $all: [senderId, userToChat] },
    }).populate<{ messages: IMessage[] }>('messages');

    return chat ? chat.messages : [];
  }

  async deleteMessages(messagesIds: string[]): Promise<IMessage[] | []> {
    try {
      const objectIds = messagesIds.map((id) => new mongoose.Types.ObjectId(id));
      const updatedMessages = await Message.updateMany(
        { _id: { $in: objectIds } },
        { $set: { isDeleted: true } }
      );

      const softDeletedMessages = await Message.find({ _id: { $in: objectIds } });

      return softDeletedMessages;
    } catch (error) {
      console.error('Error in deleteMessages:', error);
      return [];
    }
  }

  async markMessagesAsRead(receiverId: string, senderId: string): Promise<boolean | null> {
    try {
      const result = await Message.updateMany(
        {
          senderId: receiverId, // Messages sent by the other user
          receiverId: senderId, // Received by the current user
          isRead: false,
          isDeleted: { $ne: true },
        },
        { $set: { isRead: true } }
      );

      // Emit Socket.IO event to notify the sender
      const io = getIO();
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (io && receiverSocketId) {
        io.to(receiverSocketId).emit('messagesRead', {
          senderId,
          receiverId,
          unreadCount: 0, // Notify that unread count is now 0
        });
      }

      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return null;
    }
  }
}

export default MessageRepository;