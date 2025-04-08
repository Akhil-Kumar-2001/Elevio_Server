import { IChat } from "../../model/chat/chat.model";
import { IStudent } from "../../model/student/studentModel";
import { UserMinimal } from "../../Types/basicTypes";

interface IChatService{
    getChats(userId:string,role:string):Promise<UserMinimal[] | null>;
    createChat(receiverId:string,userId:string):Promise<IChat | null>
}

export default IChatService