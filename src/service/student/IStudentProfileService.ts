import { IStudent } from "../../model/student/studentModel";
import { ISubscriptionPurchased } from "../../model/subscription/SubscriptionPurchased";
import { EditStudentType, IStudentResponse } from "../../Types/basicTypes";

interface IStudentProfileService{
    getStudent(id:string):Promise<IStudent | null>;
    getSubscriptionDetails(id:string):Promise<ISubscriptionPurchased | null>;
    editProfile(id:string,formData:EditStudentType):Promise<IStudent | null>
}

export default  IStudentProfileService
