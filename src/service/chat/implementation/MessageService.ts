import { getReceiverSocketId,getIO } from "../../../Config/socketConfig";
import { IMessage } from "../../../model/chat/message.model";
import IMessageRepository from "../../../repository/chat/IMessageRepository";
import IMessageService from "../IMessageService";

class MessageService implements IMessageService{
    private _messageRepository: IMessageRepository;

    constructor(chatRepository: IMessageRepository) {
        this._messageRepository = chatRepository;
    }

    async sendMessage(receiverId: string, senderId: string, message: string,imageUrl:string) {
        const response = await this._messageRepository.sendMessage(receiverId,senderId,message,imageUrl);
        const receiverSocketId = getReceiverSocketId(receiverId);
        const io = getIO();
        if(receiverSocketId && io){
            io.to(receiverSocketId).emit("newMessage",response)
        }
        return response;
    }

    async getMessage(userToChat: string, senderId: string): Promise<IMessage[] | []> {
        const respnse = await this._messageRepository.getMessage(userToChat,senderId);
        return respnse;    
    }
}
export default MessageService
