import { TutorType } from "../../model/tutor/tutorModel"
import { OTPType } from "../../model/otp/ otpModel"
import { TutorVerificationFormData } from "../../Types/basicTypes"

interface ITutorProfileService{
    getTutorById(id:string):Promise<TutorType | null>
    verifyTutor(formData:TutorVerificationFormData):Promise<TutorType | null>
}

export default ITutorProfileService