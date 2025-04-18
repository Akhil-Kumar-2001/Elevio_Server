
import { Request, Response } from "express";

interface IStudentCourseController{
    getListedCourse(req:Request,res:Response):Promise<void>;
    getTopRatedCourse(req:Request,res:Response):Promise<void>;
    addToCart(req:Request,res:Response):Promise<void>;
    getCart(req:Request,res:Response):Promise<void>;
    removeItem(req:Request,res:Response):Promise<void>;
    createOrder(req:Request,res:Response):Promise<void>;
    verifyPayment(req:Request,res:Response):Promise<void>;
    getCategories(req:Request,res:Response):Promise<void>;
    getCourses(req:Request,res:Response):Promise<void>;
    getPurchasedCourses(req:Request,res:Response):Promise<void>;
    getCourse(req:Request,res:Response):Promise<void>;
    getTutor(req:Request,res:Response):Promise<void>;
    getSections(req:Request,res:Response):Promise<void>;
    getLectures(req:Request,res:Response):Promise<void>
    getSubscription(req:Request,res:Response):Promise<void>
    createSubscritionOrder(req:Request,res:Response):Promise<void>
    verifySubscriptionPayment(req:Request,res:Response):Promise<void>
    getReviews(req:Request,res:Response):Promise<void>
    createReview(req:Request,res:Response):Promise<void>
    getProgress(req:Request,res:Response):Promise<void>
    addLectureToProgress(req:Request,res:Response):Promise<void>

    
}
export default IStudentCourseController