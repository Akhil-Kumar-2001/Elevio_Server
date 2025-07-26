import { ISessionDto } from "../../dtos/session/sessionDto"
import { ITutorDto } from "../../dtos/tutor/tutorDto"
import { ISession } from "../../model/sessiion/sessionModel"
import { ITutor } from "../../model/tutor/tutorModel"
import { SessionInfo, TutorVerificationFormData } from "../../Types/basicTypes"

interface ITutorProfileService{
    getTutorById(id:string):Promise<ITutorDto | null>
    verifyTutor(formData:TutorVerificationFormData):Promise<ITutorDto | null>
    updateProfile(id:string,formData:ITutor):Promise<boolean | null>
    sessionExist(sessionData:ISession):Promise<boolean | null>
    createSession(sessionData:ISession):Promise<boolean | null>
    getSessions(tutorId:string):Promise<SessionInfo[] | null>
    getSessionDetails(id:string):Promise<ISessionDto | null>
    updateSessionStatus(_id:string,status:string):Promise<boolean | null>

}

export default ITutorProfileService