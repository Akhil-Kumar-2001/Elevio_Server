import { Request, Response } from "express";
import IChatService from "../../../service/chat/IChatService";
import IChatController from "../IChatController";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";

class ChatController implements IChatController{
    private _chatService: IChatService;

    constructor(chatService: IChatService) {
        this._chatService = chatService;
    }

    async getChats(req: Request, res: Response): Promise<void> {
        try {
            console.log("controller console",req.userId)
            const {role} = req.query
            const userId =req.userId
            const response = await this._chatService.getChats(userId as string,role as string);
            res.status(STATUS_CODES.OK).json({success:true,message:"Chat retrieved successfully",data:response})
        } catch (error) {
            console.log("error in the controller",error)
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR,data:null})
        }
    }
    
    async createChat(req:Request,res:Response):Promise<void>{
        try {
            const {id:receiverId} = req.params;
            const userId = req.userId;
            const response = await this._chatService.createChat(receiverId,userId as string);
            res.status(STATUS_CODES.CREATED).json({success:true,message:"Chat created successfully",data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR,data:null})
        }
    }
}

export default ChatController