import { ICategoryDto } from "../../dtos/category/categoryDto"
import { ICourseDto } from "../../dtos/course/courseDto"
import { ILectureDto } from "../../dtos/lecture/ILectureDto"
import { ISectionDto } from "../../dtos/section/ISectionDto"
import { ISubscriptionDto } from "../../dtos/subsription/subscriptionDto"
import { ITutorDto } from "../../dtos/tutor/tutorDto"
import { ITutorWalletDto } from "../../dtos/wallet/tutorwallet/tutorWalletDto"
import { ISubscriptionPlan } from "../../Types/basicTypes"
import { PaginatedResponse } from "../../Types/CategoryReturnType"

interface IAdminTutorService {

    getPendingTutors(page:number,limit:number): Promise<PaginatedResponse<ITutorDto>  | null>
    getTutorById(id: string): Promise<ITutorDto | null>
    rejectTutor(id: string): Promise<boolean | null>
    approveTutor(id: string): Promise<boolean | null>
    findCategory(name: string): Promise<boolean | null>
    createCategory(name: string): Promise<boolean | null>
    getCategories(page: number, limit: number): Promise<PaginatedResponse<ICategoryDto> | null>
    blockCategory(id: string): Promise<ICategoryDto | null>
    deleteCategory(id: string): Promise<boolean | null>
    pendingCourse(page:number,limit:number): Promise<PaginatedResponse<ICourseDto> | null>
    getCategory(): Promise<ICategoryDto[] | null>
    courseDetails(id: string): Promise<ICourseDto | null>
    getCategoryName(id: string): Promise<string | null>
    getSections(id: string): Promise<ISectionDto[] | null>
    getLectures(id: string): Promise<ILectureDto[] | null>
    rejectCourse(id:string,reason:string):Promise<boolean | null>
    getTutorMail(tutorId:string):Promise<string | null>
    approveCourse(id:string):Promise<boolean | null>
    getSubscription(page:number,limit:number):Promise<PaginatedResponse<ISubscriptionDto> | null>
    createSubscription(data:ISubscriptionPlan):Promise<boolean | null>
    editSubscription(data:ISubscriptionPlan):Promise<boolean | null>
    deleteSubscription(id:string):Promise<boolean | null>
    getTutorsWalltes(page:number,limit:number): Promise<PaginatedResponse<ITutorWalletDto> | null>
    getTutorsList():  Promise<ITutorDto[] | null>

}

export default IAdminTutorService