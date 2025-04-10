import { Request,Response } from "express"

interface IMessageController{
    sendMessage(req:Request,res:Response):Promise<void>
    getMessages(req:Request,res:Response):Promise<void>
    deleteMessages(req:Request,res:Response):Promise<void>
}

export default IMessageController