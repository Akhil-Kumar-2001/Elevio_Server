import { ICart } from "../../model/cart/cartModel";
import { ICategory } from "../../model/category/categoryModel";
import { ICourse } from "../../model/course/courseModel";
import { ILecture } from "../../model/lecture/lectureModel";
import { IOrder } from "../../model/order/orderModel";
import { IProgress } from "../../model/progress/progress.model";
import { IReview } from "../../model/review/review.model";
import { ISection } from "../../model/section/sectionModel";
import { ISubscription } from "../../model/subscription/subscriptionModel";
import { ISubscriptionPurchased } from "../../model/subscription/SubscriptionPurchased";
import { ITutor } from "../../model/tutor/tutorModel";
import { ICartWithDetails, IOrderCreateData, IOrderCreateSubscriptionData, PaymentData, review } from "../../Types/basicTypes";
import { CourseResponseDataType } from "../../Types/CategoryReturnType";

interface IStudentCourseRepository {
    getListedCourse(): Promise<ICourse[] | null>
    getTopRatedCourse(): Promise<ICourse[] | null>
    addToCart(id: string, userId: string): Promise<boolean | null>
    courseExist(id: string, userId: string): Promise<boolean | null>
    isPurchased(id: string, userId: string): Promise<boolean | null>
    getCart(studentId: string): Promise<ICartWithDetails | null>
    removeItem(id: string, studentId: string): Promise<boolean | null>
    createOrder(orderData: IOrderCreateData): Promise<IOrder | null>
    updateByOrderId(razorpay_order_id: string, status: string): Promise<string | null>
    getCategories(): Promise<ICategory[] | null>
    getCourses( page: number, limit: number): Promise<CourseResponseDataType | null>
    getPurchasedCourses( userId:string ): Promise<ICourse[] | null>
    getCourse(id:string):Promise<ICourse | null>
    getTutor(id:string):Promise<ITutor | null>
    getSections(id:string):Promise<ISection[] | null>
    getLectures(id: string): Promise<ILecture[] | null>
    getSubscription(): Promise<ISubscription[] | null>
    createSubscritionOrder(orderData:IOrderCreateSubscriptionData):Promise<ISubscriptionPurchased | null>
    isValidPlan(studentId:string):Promise<boolean | null>
    findByOrderId(orderId:string):Promise<ISubscriptionPurchased | null>
    findPlanById(_id:string):Promise<ISubscription | null>
    updateSubscriptionByOrderId(orderId:string,data:PaymentData):Promise<string | null>
    getReviews(id:string):Promise<IReview[] | null>
    createReview(formData:review):Promise<IReview | null>
    getProgress(courseId:string,userId:string):Promise<IProgress | null>
    addLectureToProgress(userId:string,courseId:string,lectureId:string):Promise<IProgress | null>

}

export default IStudentCourseRepository;