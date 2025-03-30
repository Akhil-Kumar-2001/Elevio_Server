import { ICart } from "../../model/cart/cartModel"
import { ICategory } from "../../model/category/categoryModel"
import { ICourse } from "../../model/course/courseModel"
import { IOrder } from "../../model/order/orderModel"
import { ICartWithDetails } from "../../Types/basicTypes"
import { CourseResponseDataType } from "../../Types/CategoryReturnType"

interface IStudentCourseService {
    getListedCourse():Promise<ICourse[] | null>
    addToCart(id:string,userId:string):Promise<boolean | null>
    courseExist(id:string,userId:string):Promise<boolean | null > 
    getCart(studentId:string):Promise<ICartWithDetails | null>
    removeItem(id:string,studentId:string):Promise<boolean | null > 
    createOrder(studentId:string,amount:number,courseIds:string[]):Promise<IOrder | null > 
    verifyPayment(razorpay_order_id:string,razorpay_payment_id:string,razorpay_signature:string):Promise<string | null > 
    getCategories():Promise<ICategory[] | null>
    getCourses(page:number,limit:number): Promise<CourseResponseDataType | null>
}
export default IStudentCourseService