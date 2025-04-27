import { Request, Response } from "express";

interface ITutorCourseController{
    getCategories(req:Request,res:Response):Promise<void>
    createCourse(req:Request,res:Response):Promise<void>
    getCourses(req:Request,res:Response):Promise<void>
    getCourseDetails(req:Request,res:Response):Promise<void>
    editCourse(req:Request,res:Response):Promise<void>
    createSection(req:Request,res:Response):Promise<void>
    createLecture(req:Request,res:Response):Promise<void>
    getSections(req:Request,res:Response):Promise<void>
    getLectures(req:Request,res:Response):Promise<void>
    editLecture(req:Request,res:Response):Promise<void>
    deleteLecture(req:Request,res:Response):Promise<void>
    editSection(req:Request,res:Response):Promise<void>
    uploadLectureVideo(req:Request,res:Response):Promise<void>
    applyReview(req:Request,res:Response):Promise<void>
    getNotifications(req:Request,res:Response):Promise<void>
    readNotifications(req:Request,res:Response):Promise<void>
    getCoursePreview(req:Request,res:Response):Promise<void>
    getSectionsPreview(req:Request,res:Response):Promise<void>
    getLecturesPreview(req:Request,res:Response):Promise<void>
    getReviews(req:Request,res:Response):Promise<void>
    replyReview(req:Request,res:Response):Promise<void>
    deleteReply(req:Request,res:Response):Promise<void>

}

export default ITutorCourseController