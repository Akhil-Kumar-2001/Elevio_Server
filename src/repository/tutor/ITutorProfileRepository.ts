import { ITutor } from "../../model/tutor/tutorModel"
import { TutorVerificationFormData } from "../../Types/basicTypes"

interface ITutorProfileRepository{
    getTutorById(id:string):Promise<ITutor | null>
    verifyTutor(formData:TutorVerificationFormData) : Promise<ITutor | null>
    updateProfile(id:string, formData:ITutor) : Promise<boolean | null>
}

export default ITutorProfileRepository