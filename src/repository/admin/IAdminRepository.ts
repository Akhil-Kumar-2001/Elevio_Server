import { ITutor } from "../../model/tutor/tutorModel"
import { IStudent } from "../../model/student/studentModel"
import { PaginatedResponse, TutorResponseDataType } from "../../Types/CategoryReturnType"
import { IStudentDto } from "../../dtos/student/studentDto"
import { ITutorDto } from "../../dtos/tutor/tutorDto"

interface IAdminRepository {
    getStudents(page:number,limit:number):Promise<PaginatedResponse<IStudentDto> | null>  
    getTutors(page:number,limit:number):Promise<PaginatedResponse<ITutorDto> | null>
    blockTutor(id:string):Promise<ITutorDto | null>
    blockStudent(id:string):Promise<IStudentDto | null>
}

export default IAdminRepository