import { Request, Response } from "express";
import IMessageService from "../../../service/chat/IMessageService";
import IMessageController from "../IMessageController";
import { STATUS_CODES } from "../../../constants/statusCode";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";

class MessageController implements IMessageController{
    private _messageService: IMessageService;

    constructor(messageService: IMessageService) {
        this._messageService = messageService;
    }

    async sendMessage(req: Request, res: Response): Promise<void> {
        console.log("Working params=========>",req.params);
        console.log("Working body =========>",req.body);
        console.log("Working userId =========>",req.userId);
        try {
            const {id:receiverId} = req.params;
            const {message,imageUrl} = req.body;
            const senderId = req.userId;
            const response = await this._messageService.sendMessage(receiverId,senderId as string,message,imageUrl);
            console.log("response after sending message successfully",response)
            res.status(STATUS_CODES.CREATED).json({success:true,message:"Message send successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR,data:null})
        }
    }
    
    async getMessages(req: Request, res: Response): Promise<void> {
        try {
            const {id:userToChat} = req.params;
            const senderId = req.userId as string
            
            const response = await this._messageService.getMessage(userToChat,senderId);
            res.status(STATUS_CODES.OK).json({success:true,message:"Getting messages Successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({success:false,message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR,data:null})
        }
    }
}

export default MessageController