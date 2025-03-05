import { TutorType } from "../../model/tutor/tutorModel"
import { StudentType } from "../../model/student/studentModel"

interface IAdminTutorRepository{
    getPendingTutors():Promise<TutorType[] | null>
    getTutorById(id:string):Promise<TutorType | null>
    rejectTutor(id:string):Promise<boolean | null>
    approveTutor(id:string):Promise<boolean | null>
}

export default IAdminTutorRepository