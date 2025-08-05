import { PaginatedResponse } from "../../Types/CategoryReturnType"
import { IStudentDto } from "../../dtos/student/studentDto"
import { ITutorDto } from "../../dtos/tutor/tutorDto"

interface IAdminService {
    getStudents(page:number,limit:number):Promise<PaginatedResponse<IStudentDto>| null>  
    getTutors(page:number,limit:number):Promise<PaginatedResponse<ITutorDto> | null> 
    blockTutor(id:string) :Promise<ITutorDto | null>
    blockStudent(id:string) :Promise<IStudentDto | null>
    searchTutor(query:string,page:number,limit:number) :Promise<PaginatedResponse<ITutorDto> | null>
    searchStudents(query:string,page:number,limit:number) :Promise<PaginatedResponse<IStudentDto> | null>
}

export default IAdminService