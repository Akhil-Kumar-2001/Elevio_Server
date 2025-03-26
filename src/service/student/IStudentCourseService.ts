import { ICourse } from "../../model/course/courseModel"

interface IStudentCourseService {
    getListedCourse():Promise<ICourse[] | null>
    addToCart(id:string,userId:string):Promise<boolean | null>
    courseExist(id:string,userId:string):Promise<boolean | null > 
}
export default IStudentCourseService