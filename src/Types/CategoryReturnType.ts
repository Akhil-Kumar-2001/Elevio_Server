import { ICategory } from "../model/category/categoryModel";
import { ICourse } from "../model/course/courseModel";


export interface CategoryResponseDataType{
    categories: ICategory[],
    totalRecord : number
}

export interface CourseResponseDataType{
    courses:ICourse[],
    totalRecord:number
}