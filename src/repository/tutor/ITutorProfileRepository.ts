import { ICategory } from "../../model/category/categoryModel"
import { ISession } from "../../model/sessiion/sessionModel"
import { ITutor } from "../../model/tutor/tutorModel"
import { SessionInfo, TutorVerificationFormData } from "../../Types/basicTypes"

interface ITutorProfileRepository{
    getTutorById(id:string):Promise<ITutor | null>
    verifyTutor(formData:TutorVerificationFormData) : Promise<ITutor | null>
    updateProfile(id:string, formData:ITutor) : Promise<boolean | null>
    sessionExist(sessionData:ISession) : Promise<boolean | null>
    createSession(sessionData:ISession) : Promise<boolean | null>
    getSessions(tutorId:string) : Promise<SessionInfo[] | null>
    getSessionDetails(id:string) : Promise<ISession | null>
    updateSessionStatus(_id:string,status:string):Promise<boolean | null>
}

export default ITutorProfileRepository