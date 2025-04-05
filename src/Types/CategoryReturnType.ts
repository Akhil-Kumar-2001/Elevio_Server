import { ICategory } from "../model/category/categoryModel";
import { ICourse } from "../model/course/courseModel";
import { IStudent } from "../model/student/studentModel";
import { ITutor } from "../model/tutor/tutorModel";
import { ISubscription } from "../model/subscription/subscriptionModel";


export interface CategoryResponseDataType{
    categories: ICategory[],
    totalRecord : number
}
export interface TutorResponseDataType{
    tutors: ITutor[],
    totalRecord : number
}
export interface StudentResponseDataType{
    students: IStudent[],
    totalRecord : number
}

export interface CourseResponseDataType{
    courses:ICourse[],
    totalRecord:number
}
export interface SubscriptionResponseDataType{
    subscriptions:ISubscription[],
    totalRecord:number
}