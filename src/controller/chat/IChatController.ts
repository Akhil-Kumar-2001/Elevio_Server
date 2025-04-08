import { Request, Response } from "express";

interface IChatController{
    getChats(req:Request,res:Response):Promise<void>
    createChat(req:Request,res:Response):Promise<void>
}

export default IChatController