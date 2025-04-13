import { IMessage } from "../../model/chat/message.model";

interface IMessageService {
    sendMessage(receiverId:string,senderId:string,message:string,imageUrl:string):Promise<IMessage | null>;
    getMessage(userToChat:string,senderId:string):Promise<IMessage[] | []>;
    deleteMessages(receiverId:string,messagesIds:string[]):Promise<IMessage[] | []>;
    markMessagesAsRead(receiverId:string,senderId:string):Promise<boolean | null>

}

export default IMessageService