import { ITutor } from "../../model/tutor/tutorModel"
import { IStudent } from "../../model/student/studentModel"

interface IAdminRepository {
    getStudents():Promise<IStudent[] | null >   
    getTutors():Promise<IStudent[] | null>
    blockTutor(id:string):Promise<ITutor | null>
    blockStudent(id:string):Promise<IStudent | null>
}

export default IAdminRepository