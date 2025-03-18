import { ICategory } from "../../model/category/categoryModel"
import { ITutor } from "../../model/tutor/tutorModel"
import { TutorVerificationFormData } from "../../Types/basicTypes"

interface ITutorProfileService{
    getTutorById(id:string):Promise<ITutor | null>
    verifyTutor(formData:TutorVerificationFormData):Promise<ITutor | null>
    updateProfile(id:string,formData:ITutor):Promise<boolean | null>
}

export default ITutorProfileService