import { ICategoryDto } from "../../dtos/category/categoryDto"
import { ICourseDto, ICourseResponseDto, ICourseSearchServiceDto } from "../../dtos/course/courseDto"
import { ILectureDto } from "../../dtos/lecture/ILectureDto"
import { IOrderDto } from "../../dtos/order/orderDto"
import { IProgressResponseDto } from "../../dtos/progress/progressDto"
import { IReviewDto, IReviewResponseDto } from "../../dtos/review/IReviewResponseDto"
import { ISectionDto } from "../../dtos/section/ISectionDto"
import { ISubscriptionDto } from "../../dtos/subsription/subscriptionDto"
import { ITutorDto } from "../../dtos/tutor/tutorDto"
import { ISubscriptionPurchased } from "../../model/subscription/SubscriptionPurchased"
import { EditReview, ICartWithDetails, review } from "../../Types/basicTypes"
import { PaginatedResponse } from "../../Types/CategoryReturnType"

interface IStudentCourseService {
    getListedCourse(): Promise<ICourseDto[] | null>
    getTopRatedCourse(): Promise<ICourseDto[] | null>
    addToCart(id: string, userId: string): Promise<boolean | null>
    isPurchased(id: string, userId: string): Promise<boolean | null>
    courseExist(id: string, userId: string): Promise<boolean | null>
    getCart(studentId: string): Promise<ICartWithDetails | null>
    removeItem(id: string, studentId: string): Promise<boolean | null>
    createOrder(studentId: string, amount: number, courseIds: string[]): Promise<IOrderDto | null>
    searchCourse(query: string, page: number, limit: number, category:string, priceRange:[number,number],sortOrder:string): Promise<PaginatedResponse<ICourseSearchServiceDto> | null>
    verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<string | null>
    getCategories(): Promise<ICategoryDto[] | null>
    getCourses(page: number, limit: number): Promise<PaginatedResponse<ICourseDto> | null>
    getPurchasedCourses(userId: string): Promise<ICourseDto[] | null>
    getCourse(id:string):Promise<ICourseResponseDto | null>
    getTutor(id:string):Promise<ITutorDto | null>
    getSections(courseId: string): Promise<ISectionDto[] | null>
    getLectures(courseId: string): Promise<ILectureDto[] | null>
    getSubscription(): Promise<ISubscriptionDto[] | null>
    isValidPlan(studentId:string):Promise<boolean | null>
    createSubscritionOrder(studentId:string,amount:number,planId:string): Promise<ISubscriptionPurchased | null>
    verifySubscriptionPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<string | null>
    getReviews(id:string):Promise<IReviewDto[] | null>
    createReview(formData:review):Promise<IReviewDto | null>
    getProgress(courseId:string,userId:string):Promise<IProgressResponseDto | null>
    addLectureToProgress(userId:string,courseId:string,lectureId:string):Promise<IProgressResponseDto | null>
    editReview(id:string,formData:EditReview):Promise<IReviewResponseDto | null>
    deleteReview(id:string):Promise<boolean | null>
    getWishlist(userId:string):Promise<ICourseDto[] | null>
    addToWishlist(userId:string,courseId:string):Promise<boolean | null>
    removeFromWishlist(userId:string,courseId:string):Promise<boolean | null>
    isInWishlist(userId:string,courseId:string):Promise<boolean | null>


}
export default IStudentCourseService