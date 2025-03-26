import { IStudent } from "../../model/student/studentModel";
import { EditStudentType } from "../../Types/basicTypes";

interface IStudentProfileService{
    getStudent(id:string):Promise<IStudent | null>;
    editProfile(id:string,formData:EditStudentType):Promise<IStudent | null>
}

export default  IStudentProfileService
