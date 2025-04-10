import { IMessage } from "../../model/chat/message.model";

interface IMessageRepository{
    sendMessage(id:string,senderId:string,message:string,imageUrl:string):Promise<IMessage | null>;
    getMessage(userToChat:string,senderId:string):Promise<IMessage[] | [] >
}
export default  IMessageRepository