
import { Request, Response } from "express";

interface IStudentCourseController{
    getListedCourse(req:Request,res:Response):Promise<void>;
    addToCart(req:Request,res:Response):Promise<void>;
}
export default IStudentCourseController