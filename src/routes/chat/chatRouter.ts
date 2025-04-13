import Router from 'express'
import ChatRepository from '../../repository/chat/implementation/ChatRepository';
import ChatService from '../../service/chat/implementation/ChatService';
import ChatController from '../../controller/chat/implementation/ChatController';
import MessageRepository from '../../repository/chat/implementation/MessageRepository';
import MessageService from '../../service/chat/implementation/MessageService';
import MessageController from '../../controller/chat/implementation/MessageController';
import IMessageController from '../../controller/chat/IMessageController';
import authenticationMiddleware from '../../middleware/authenticationMiddleware'
import IChatController from '../../controller/chat/IChatController';


const router = Router();

const chatRepository = new ChatRepository();
const chatService = new ChatService(chatRepository);
const chatController:IChatController = new ChatController(chatService);

const messageRepository = new MessageRepository();
const messageService = new MessageService(messageRepository);
const messageController:IMessageController = new MessageController(messageService)


router.post('/send/:id',authenticationMiddleware(),messageController.sendMessage.bind(messageController));
router.get('/getChats',authenticationMiddleware(), chatController.getChats.bind(chatController));
router.get('/get-messages/:id',authenticationMiddleware(),messageController.getMessages.bind(messageController));
router.post('/create-chat/:id',authenticationMiddleware(),chatController.createChat.bind(chatController));
router.delete('/delete-message/:id',authenticationMiddleware(),messageController.deleteMessages.bind(messageController));
router.post('/mark-read/:id',authenticationMiddleware(),messageController.markMessagesAsRead.bind(messageController))

export default router;