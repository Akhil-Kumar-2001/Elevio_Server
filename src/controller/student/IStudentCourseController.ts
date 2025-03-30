
import { Request, Response } from "express";

interface IStudentCourseController{
    getListedCourse(req:Request,res:Response):Promise<void>;
    addToCart(req:Request,res:Response):Promise<void>;
    getCart(req:Request,res:Response):Promise<void>;
    removeItem(req:Request,res:Response):Promise<void>;
    createOrder(req:Request,res:Response):Promise<void>;
    verifyPayment(req:Request,res:Response):Promise<void>;
    getCategories(req:Request,res:Response):Promise<void>;
    getCourses(req:Request,res:Response):Promise<void>;
    
}
export default IStudentCourseController