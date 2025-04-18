import Razorpay from 'razorpay'
import { Types } from "mongoose";
import crypto from "crypto";
import { ICart } from "../../../model/cart/cartModel";
import { ICourse } from "../../../model/course/courseModel";
import { IOrder } from "../../../model/order/orderModel";
import IStudentCourseRepository from "../../../repository/student/IStudentCourseRepository";
import { ICartWithDetails, IOrderCreateSubscriptionData, review } from "../../../Types/basicTypes";
import IStudentCourseService from "../IStudentCourseService";
import { ICategory } from '../../../model/category/categoryModel';
import { CourseResponseDataType } from '../../../Types/CategoryReturnType';
import { ISection } from '../../../model/section/sectionModel';
import { ILecture } from '../../../model/lecture/lectureModel';
import { ISubscription } from '../../../model/subscription/subscriptionModel';
import { ISubscriptionPurchased } from '../../../model/subscription/SubscriptionPurchased';
import { ITutor } from '../../../model/tutor/tutorModel';
import { IReview } from '../../../model/review/review.model';
import { IProgress } from '../../../model/progress/progress.model';

class StudentCourseService implements IStudentCourseService {
    private _studentCourseRepository: IStudentCourseRepository;
    private _razorpay: Razorpay

    constructor(studentCourseRepository: IStudentCourseRepository) {
        this._studentCourseRepository = studentCourseRepository;
        this._razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });
    }

    async getListedCourse(): Promise<ICourse[] | null> {
        const courses = await this._studentCourseRepository.getListedCourse();
        return courses
    }

    async getTopRatedCourse(): Promise<ICourse[] | null> {
        const courses = await this._studentCourseRepository.getTopRatedCourse();
        return courses
    }

    async addToCart(id: string, userId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.addToCart(id, userId);
        return response;
    }

    async courseExist(id: string, userId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.courseExist(id, userId);
        return response
    }

    async isPurchased(id: string, userId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.isPurchased(id, userId);
        return response;
    }

    async getCart(studentId: string): Promise<ICartWithDetails | null> {
        const response = await this._studentCourseRepository.getCart(studentId);
        return response
    }

    async removeItem(id: string, studentId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.removeItem(id, studentId);
        return response
    }

    async createOrder(studentId: string, amount: number, courseIds: string[]): Promise<IOrder | null> {

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${studentId}`,
            payment_capture: 1,
        }

        const razorpayOrder = await this._razorpay.orders.create(options);

        const orderData = {
            userId: new Types.ObjectId(studentId),
            courseIds: courseIds.map((id) => new Types.ObjectId(id)),
            razorpayOrderId: razorpayOrder.id,
            amount: (razorpayOrder.amount as number),
            status: "pending" as const,
            paymentMethod: "razorpay",
        };

        const createdOrder = await this._studentCourseRepository.createOrder(orderData);
        console.log("c", createdOrder);
        return createdOrder
    }

    async verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<string | null> {
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            throw new Error("Payment signature verification failed");
        }

        const payment = await this._razorpay.payments.fetch(razorpay_payment_id);

        console.log("payment status capture", payment.status)

        if (payment.status === "captured") {
            const updatedOrder = await this._studentCourseRepository.updateByOrderId(razorpay_order_id, "success");
            return updatedOrder;
        } else {
            const updatedOrder = await this._studentCourseRepository.updateByOrderId(razorpay_order_id, "failed");
            return updatedOrder
        }
    }

    async getCategories(): Promise<ICategory[] | null> {
        const response = await this._studentCourseRepository.getCategories();
        return response;
    }
    async getCourses(page: number, limit: number): Promise<CourseResponseDataType | null> {
        const response = await this._studentCourseRepository.getCourses(page, limit);
        return response;
    }

    async getPurchasedCourses(userId: string): Promise<ICourse[] | null> {
        const response = await this._studentCourseRepository.getPurchasedCourses(userId);
        return response;
    }

    async getSections(id: string): Promise<ISection[] | null> {
        const sections = await this._studentCourseRepository.getSections(id);
        return sections;
    }

    async getLectures(id: string): Promise<ILecture[] | null> {
        const response = await this._studentCourseRepository.getLectures(id);
        return response
    }

    async getCourse(id: string): Promise<ICourse | null> {
        const response = await this._studentCourseRepository.getCourse(id);
        return response;
    }

    async getTutor(id: string): Promise<ITutor | null> {
        const response = await this._studentCourseRepository.getTutor(id);
        return response;
    }

    async getSubscription(): Promise<ISubscription[] | null> {
        const response = await this._studentCourseRepository.getSubscription();
        return response
    }

    async isValidPlan(studentId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.isValidPlan(studentId);
        return response;
    }

    async createSubscritionOrder(studentId: string, amount: number, planId: string): Promise<ISubscriptionPurchased | null> {

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${studentId}`,
            payment_capture: 1,
        }

        const razorpayOrder = await this._razorpay.orders.create(options);
        console.log("rz", razorpayOrder)

        const orderData: IOrderCreateSubscriptionData = {
            userId: new Types.ObjectId(studentId),
            planId: new Types.ObjectId(planId),
            startDate: null,
            endDate: null,
            orderId: razorpayOrder.id,
            status: "pending",
            paymentStatus: "pending",
            paymentDetails: {
                paymentAmount: Number(razorpayOrder.amount),
                paymentMethod: "Razorpay"
            }
        };


        const order = await this._studentCourseRepository.createSubscritionOrder(orderData)
        return order;

    }

    async verifySubscriptionPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<string | null> {
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            throw new Error("Payment signature verification failed");
        }

        const payment = await this._razorpay.payments.fetch(razorpay_payment_id);

        console.log("payment status capture", payment.status)

        if (payment.status === "captured") {

            const subscription = await this._studentCourseRepository.findByOrderId(razorpay_order_id);

            if (!subscription) {
                return null
            }

            const plan = await this._studentCourseRepository.findPlanById(subscription.planId.toString());

            if (!plan) {
                return null
            }

            const endDate = new Date();
            if (plan.duration.unit === "day") {
                endDate.setDate(endDate.getDate() + plan.duration.value);
            } else if (plan.duration.unit === "month") {
                endDate.setMonth(endDate.getMonth() + plan.duration.value);
            } else if (plan.duration.unit === "quarter") {
                endDate.setMonth(endDate.getMonth() + (plan.duration.value * 3));
            } else if (plan.duration.unit === "year") {
                endDate.setFullYear(endDate.getFullYear() + plan.duration.value);
            }

            const updatedPaymentDetails = {
                ...subscription.paymentDetails,  
                paymentId: razorpay_payment_id  
            };
            console.log("updated paymentdetails",updatedPaymentDetails)

            const data = {
                paymentStatus: "paid" as const,
                status: "active" as const,
                startDate: new Date(),
                endDate: endDate,
                paymentDetails: updatedPaymentDetails
            }

            const updatedSubscription = await this._studentCourseRepository.updateSubscriptionByOrderId(razorpay_order_id,data);
            return updatedSubscription 
        }else{
            const updatedSubscription = await this._studentCourseRepository.updateSubscriptionByOrderId(razorpay_order_id, {
                paymentStatus: "failed",
                status: "canceled",
                paymentDetails: {
                    paymentId: razorpay_payment_id,
                }
            });
            return updatedSubscription
        }

    }

    async getReviews(id: string): Promise<IReview[] | null> {
        const response = await this._studentCourseRepository.getReviews(id);
        return response
    }

    async createReview(formData: review): Promise<IReview | null> {
        const response = await this._studentCourseRepository.createReview(formData);
        return response
    }

    async getProgress(courseId: string,userId:string): Promise<IProgress | null> {
        const response = await this._studentCourseRepository.getProgress(courseId,userId);
        return response
    }

    async addLectureToProgress(userId: string, courseId: string, lectureId: string): Promise<IProgress | null> {
        const response = await this._studentCourseRepository.addLectureToProgress(userId,courseId,lectureId);
        return response;
    }
}

export default StudentCourseService