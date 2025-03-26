import { ICourse } from "../../model/course/courseModel";

interface IStudentCourseRepository {
    getListedCourse():Promise<ICourse[] | null>
    addToCart(id:string,userId:string):Promise<boolean | null>
    courseExist(id:string,userId:string):Promise<boolean | null>
}

export default IStudentCourseRepository;