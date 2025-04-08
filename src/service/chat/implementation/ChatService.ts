import { IChat } from "../../../model/chat/chat.model";
import { IStudent } from "../../../model/student/studentModel";
import IChatRepository from "../../../repository/chat/IChatRepository";
import { UserMinimal } from "../../../Types/basicTypes";
import IChatService from "../IChatService";

class ChatService implements IChatService{
    private _chatRepository: IChatRepository;

    constructor(chatRepository: IChatService) {
        this._chatRepository = chatRepository;
    }

    async getChats(userId:string,role:string): Promise<UserMinimal[] | null> {
        const response = await this._chatRepository.getChats(userId,role);
        return response
    }

    async createChat(receiverId: string, userId: string): Promise<IChat | null> {
        const response = await this._chatRepository.createChat(receiverId,userId);
        return response
    }
}

export default ChatService;