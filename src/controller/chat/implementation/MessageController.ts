import { Request, Response } from 'express';
import IMessageService from '../../../service/chat/IMessageService';
import IMessageController from '../IMessageController';
import { STATUS_CODES } from '../../../constants/statusCode';
import { ERROR_MESSAGES } from '../../../constants/errorMessage';

class MessageController implements IMessageController {
  private _messageService: IMessageService;

  constructor(messageService: IMessageService) {
    this._messageService = messageService;
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { id: receiverId } = req.params;
      const { message, imageUrl } = req.body;
      const senderId = req.userId as string;
      const response = await this._messageService.sendMessage(receiverId, senderId, message, imageUrl);
      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: 'Message sent successfully',
        data: response,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        data: null,
      });
    }
  }

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { id: userToChat } = req.params;
      const senderId = req.userId as string;
      const response = await this._messageService.getMessage(userToChat, senderId);
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: 'Messages retrieved successfully',
        data: response,
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        data: null,
      });
    }
  }

  async deleteMessages(req: Request, res: Response): Promise<void> {
    try {
      const { id: receiverId } = req.params;
      const messagesIds = req.body.messageIds;
      const response = await this._messageService.deleteMessages(receiverId, messagesIds);
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: 'Messages deleted successfully',
        data: response,
      });
    } catch (error) {
      console.error('Error deleting messages:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        data: null,
      });
    }
  }

  async markMessagesAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id: receiverId } = req.params;
      const senderId = req.userId as string;
      const response = await this._messageService.markMessagesAsRead(receiverId, senderId);
      res.status(STATUS_CODES.OK).json({
        success: true,
        message: 'Messages marked as read',
        data: response,
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        data: null,
      });
    }
  }
}

export default MessageController;