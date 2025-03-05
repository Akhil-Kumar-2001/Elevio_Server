import { TutorType } from "../../model/tutor/tutorModel"
import { StudentType } from "../../model/student/studentModel"

interface IAdminService {
    getStudents():Promise<StudentType[] | null >  
    getTutors():Promise<StudentType[] | null> 
    blockTutor(id:string) :Promise<TutorType | null>
    blockStudent(id:string) :Promise<StudentType | null>
}

export default IAdminService