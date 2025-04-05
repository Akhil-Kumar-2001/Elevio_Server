import { ITutor } from "../../model/tutor/tutorModel"
import { IStudent } from "../../model/student/studentModel"
import { StudentResponseDataType, TutorResponseDataType } from "../../Types/CategoryReturnType"

interface IAdminService {
    getStudents(page:number,limit:number):Promise<StudentResponseDataType | null >  
    getTutors(page:number,limit:number):Promise<TutorResponseDataType | null> 
    blockTutor(id:string) :Promise<ITutor | null>
    blockStudent(id:string) :Promise<IStudent | null>
}

export default IAdminService