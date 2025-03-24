import { Request,Response } from "express"

interface ITutorController{
    signupPost(req:Request,res:Response):Promise<void>
    verifyOtp(req:Request,res:Response):Promise<void>
    resendOtp(req:Request,res:Response):Promise<void>
    signinPost(req:Request,res:Response):Promise<void>
    refreshToken(req:Request,res:Response):Promise<void>
    logout(req:Request,res:Response):Promise<void>
    forgotPassword(req:Request,res:Response):Promise<void>
    verifyForgotOtp(req:Request,res:Response):Promise<void>
    resetPassword(req:Request,res:Response):Promise<void>
    googleAuth(req:Request,res:Response):Promise<void>
}

export default  ITutorController