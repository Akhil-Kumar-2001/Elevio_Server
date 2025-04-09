import { ICategory } from "../../model/category/categoryModel"
import { ICourse } from "../../model/course/courseModel"
import { ILecture } from "../../model/lecture/lectureModel"
import { INotification } from "../../model/notification/notification.Model"
import { ISection } from "../../model/section/sectionModel"
import { ISubscription } from "../../model/subscription/subscriptionModel"
import { ITutor } from "../../model/tutor/tutorModel"
import { ISubscriptionPlan } from "../../Types/basicTypes"
import { CategoryResponseDataType, CourseResponseDataType, SubscriptionResponseDataType, TutorResponseDataType } from "../../Types/CategoryReturnType"

interface IAdminTutorRepository {
    getPendingTutors(page:number,limit:number): Promise<TutorResponseDataType | null>
    getTutorById(id: string): Promise<ITutor | null>
    rejectTutor(id: string): Promise<boolean | null>
    approveTutor(id: string): Promise<boolean | null>
    findCategory(name: string): Promise<boolean | null>
    createCategory(name: string): Promise<boolean | null>
    getCategories(page: number, limit: number): Promise<CategoryResponseDataType | null>
    blockCategory(id: string): Promise<ICategory | null>
    deleteCategory(id: string): Promise<boolean | null>
    pendingCourse(page:number,limit:number): Promise<CourseResponseDataType | null>
    getCategory(): Promise<ICategory[] | null>
    courseDetails(id:string):Promise<ICourse | null>
    getSections(id:string):Promise<ISection[] | null>
    getLectures(id: string): Promise<ILecture[] | null>
    rejectCourse(id:string,reason:string):Promise<INotification | null>
    getTutorMail(tutorId:string):Promise<string | null>
    approveCourse(id:string):Promise<boolean | null>
    getSubscription(page:number,limit:number):Promise<SubscriptionResponseDataType | null>
    createSubscription(data:ISubscriptionPlan):Promise<boolean | null>
    editSubscription(data:ISubscriptionPlan):Promise<boolean | null>
    deleteSubscription(id:string):Promise<boolean | null>

}

export default IAdminTutorRepository