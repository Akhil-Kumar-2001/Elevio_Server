import Razorpay from 'razorpay'
import { Types } from "mongoose";
import crypto from "crypto";
import IStudentCourseRepository from "../../../repository/student/IStudentCourseRepository";
import { ICartWithDetails, IOrderCreateSubscriptionData, review } from "../../../Types/basicTypes";
import IStudentCourseService from "../IStudentCourseService";
import { PaginatedResponse } from '../../../Types/CategoryReturnType';
import { ISubscriptionPurchased } from '../../../model/subscription/SubscriptionPurchased';
import { mapCourseResponseToDto, mapCoursesToDto, mapToCourseSearchDto } from '../../../mapper/course/courseMapper';
import { ICourseDto, ICourseResponseDto, ICourseSearchServiceDto } from '../../../dtos/course/courseDto';
import { mapOrderToDto } from '../../../mapper/order/orderMapper';
import { IOrderDto } from '../../../dtos/order/orderDto';
import { ICategoryDto } from '../../../dtos/category/categoryDto';
import { mapCategoriesToDto } from '../../../mapper/category/categoryMapper';
import { ITutorDto } from '../../../dtos/tutor/tutorDto';
import { mapTutorToDto } from '../../../mapper/tutor/tutorMapper';
import { ISectionDto } from '../../../dtos/section/ISectionDto';
import { ILectureDto } from '../../../dtos/lecture/ILectureDto';
import { MapToSectionsDto } from '../../../mapper/section/sectionMapper';
import { mapLecturesToDto } from '../../../mapper/lecture/lectureMapper';
import { ISubscriptionDto } from '../../../dtos/subsription/subscriptionDto';
import { mapSubscriptionsToDto } from '../../../mapper/subscription/subscriptionMapper';
import { IReviewDto, IReviewResponseDto } from '../../../dtos/review/IReviewResponseDto';
import { mapReviewReponseToDto, mapReviewsReponseToDtoList, mapReviewToDto } from '../../../mapper/review/reviewMapper';
import { IProgressResponseDto } from '../../../dtos/progress/progressDto';
import { mapProgressToDto } from '../../../mapper/progress/progressMapper';
import s3 from '../../../Config/awsConfig';
import { getSignedImageUrl } from '../../../utils/cloudinaryUtility';

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

    async getListedCourse(): Promise<ICourseDto[] | null> {
        const courses = await this._studentCourseRepository.getListedCourse();
        if (!courses) return null;

        for (const course of courses) {
            if (course.imageThumbnail) {
                course.imageThumbnail = getSignedImageUrl(course.imageThumbnail);
            }
        }

        const dto = mapCoursesToDto(courses);
        return dto
    }

    async getTopRatedCourse(): Promise<ICourseDto[] | null> {
        const courses = await this._studentCourseRepository.getTopRatedCourse();
        if (!courses) return null;

        for (const course of courses) {
            if (course.imageThumbnail) {
                course.imageThumbnail = getSignedImageUrl(course.imageThumbnail);
            }
        }

        const dto = mapCoursesToDto(courses);
        return dto
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
        if (!response) return null;
        for (const course of response?.items) {
            if (course.courseImage) {
                course.courseImage = getSignedImageUrl(course.courseImage);
            }
        }
        return response
    }

    async removeItem(id: string, studentId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.removeItem(id, studentId);
        return response
    }

    async createOrder(studentId: string, amount: number, courseIds: string[]): Promise<IOrderDto | null> {
        const courseIdArray = Array.isArray(courseIds) ? courseIds : [courseIds];

        for (const courseId of courseIdArray) {
            const pendingOrder = await this._studentCourseRepository.findPendingOrder(studentId, courseId);
            if (pendingOrder) {
                throw new Error("A payment is already in progress for this course. Please complete it before retrying.");
            }
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${studentId}`,
            payment_capture: 1,
        };

        const razorpayOrder = await this._razorpay.orders.create(options);

        const orderData = {
            userId: new Types.ObjectId(studentId),
            courseIds: courseIds.map((id) => new Types.ObjectId(id)),
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount as number,
            status: "pending" as const,
            paymentMethod: "razorpay",
            // sessionId,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        };

        const createdOrder = await this._studentCourseRepository.createOrder(orderData);
        if (!createdOrder) return null;

        return mapOrderToDto(createdOrder);
    }


    async verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<string | null> {
        if (!razorpay_payment_id || !razorpay_signature) {
            await this._studentCourseRepository.updateByOrderId(razorpay_order_id, "failed");
            return "failed";
        }
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            throw new Error("Payment signature verification failed");
        }
        const payment = await this._razorpay.payments.fetch(razorpay_payment_id);


        if (payment.status === "captured") {
            const updatedOrder = await this._studentCourseRepository.updateByOrderId(razorpay_order_id, "success");
            return updatedOrder;
        } else {
            const updatedOrder = await this._studentCourseRepository.updateByOrderId(razorpay_order_id, "failed");
            return updatedOrder
        }
    }

    async getCategories(): Promise<ICategoryDto[] | null> {
        const response = await this._studentCourseRepository.getCategories();
        if (!response) return null;
        const dto = mapCategoriesToDto(response);
        return dto;
    }

    async getCourses(page: number, limit: number): Promise<PaginatedResponse<ICourseDto> | null> {
        const response = await this._studentCourseRepository.getCourses(page, limit);
        if (!response) return null;

        // Convert imageThumbnail to signed URL for each course
        for (const course of response.courses) {
            if (course.imageThumbnail) {
                course.imageThumbnail = getSignedImageUrl(course.imageThumbnail);
            }
        }
        const dto = mapCoursesToDto(response.courses);
        return { data: dto, totalRecord: response.totalRecord };
    }



    async searchCourse(
        query: string,
        page: number,
        limit: number,
        category?: string,
        priceRange?: [number, number],
        sortOrder?: string | null
    ): Promise<PaginatedResponse<ICourseSearchServiceDto> | null> {
        const course = await this._studentCourseRepository.searchCourse(
            query,
            page,
            limit,
            category ?? "",
            priceRange ?? [0, 5000],
            sortOrder ?? null
        );

        if (!course) return null;

        const dto = {
            data: course.data.map(mapToCourseSearchDto),
            totalRecord: course.totalRecord,
        };
        return dto;
    }




    async getPurchasedCourses(userId: string): Promise<ICourseDto[] | null> {
        const courses = await this._studentCourseRepository.getPurchasedCourses(userId);
        if (!courses) return null;

        for (const course of courses) {
            if (course.imageThumbnail) {
                course.imageThumbnail = getSignedImageUrl(course.imageThumbnail);
            }
        }
        const dto = mapCoursesToDto(courses);
        return dto;
    }

    async getSections(id: string): Promise<ISectionDto[] | null> {
        const sections = await this._studentCourseRepository.getSections(id);
        if (!sections) return null;
        const dto = MapToSectionsDto(sections)
        return dto;
    }


    async getSignedVideoUrl(lectureId: string, expiresInSeconds = 300): Promise<string> {
        const lecture = await this._studentCourseRepository.findById(lectureId);

        if (!lecture) {
            throw new Error(`Lecture with id ${lectureId} not found.`);
        }

        if (!lecture.videoKey) {
            throw new Error("Video key not found for this lecture.");
        }

        const signedUrl = await s3.getSignedUrlPromise("getObject", {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: lecture.videoKey,
            Expires: expiresInSeconds,
        });

        return signedUrl;
    }


    async getLectures(id: string): Promise<ILectureDto[] | null> {
        const lectures = await this._studentCourseRepository.getLectures(id);
        if (!lectures) return null;

        const lecturesWithSignedUrls = await Promise.all(
            lectures.map(async (lecture) => {
                let videoUrl: string | null = null;

                if (lecture.videoKey) {
                    try {
                        videoUrl = await this.getSignedVideoUrl(lecture._id);
                    } catch (error) {
                        console.error(`Error generating signed URL for lecture ${lecture._id}`, error);
                    }
                }

                return {
                    ...lecture.toObject(),
                    videoUrl,
                };
            })
        );

        const dto = mapLecturesToDto(lecturesWithSignedUrls)
        return dto;
    }

    async getCourse(id: string): Promise<ICourseResponseDto | null> {
        const response = await this._studentCourseRepository.getCourse(id);
        if (!response) return null;

        if (response.imageThumbnail) {
            response.imageThumbnail = getSignedImageUrl(response.imageThumbnail);
        }
        const dto = mapCourseResponseToDto(response)
        return dto;
    }

    async getTutor(id: string): Promise<ITutorDto | null> {
        const response = await this._studentCourseRepository.getTutor(id);
        if (!response) return null;
        const dto = mapTutorToDto(response);
        return dto;
    }

    async getSubscription(): Promise<ISubscriptionDto[] | null> {
        const response = await this._studentCourseRepository.getSubscription();
        if (!response) return null;
        const dto = mapSubscriptionsToDto(response);
        return dto;
    }

    async isValidPlan(studentId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.isValidPlan(studentId);
        return response;
    }

    async createSubscritionOrder(studentId: string, amount: number, planId: string): Promise<ISubscriptionPurchased | null> {

        const pendingOrder = await this._studentCourseRepository.findPendingSubscriptionOrder(studentId);
        if (pendingOrder) {
            throw new Error('A subscription payment is already in progress for this course. Please complete it before retrying.');
        }
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${studentId}`,
            payment_capture: 1,
        }

        const razorpayOrder = await this._razorpay.orders.create(options);

        const orderData: IOrderCreateSubscriptionData = {
            userId: new Types.ObjectId(studentId),
            planId: new Types.ObjectId(planId),
            startDate: null,
            endDate: null,
            orderId: razorpayOrder.id,
            status: "pending",
            paymentStatus: "pending",
            expireAt: undefined,
            paymentDetails: {
                paymentAmount: Number(razorpayOrder.amount),
                paymentMethod: "Razorpay"
            },


        };


        const order = await this._studentCourseRepository.createSubscriptionOrder(orderData)
        console.log(order)
        return order;

    }

    async verifySubscriptionPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<string | null> {
        if (!razorpay_payment_id || !razorpay_signature) {
            await this._studentCourseRepository.updateSubscriptionByOrderId(razorpay_order_id, {
                paymentStatus: "failed",
                status: "canceled",
            });
            return "failed";
        }
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
            console.log("updated paymentdetails", updatedPaymentDetails)

            const data = {
                paymentStatus: "paid" as const,
                status: "active" as const,
                startDate: new Date(),
                endDate: endDate,
                paymentDetails: updatedPaymentDetails
            }

            const updatedSubscription = await this._studentCourseRepository.updateSubscriptionByOrderId(razorpay_order_id, data);
            return updatedSubscription
        } else {
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

    async getReviews(id: string): Promise<IReviewDto[] | null> {
        const response = await this._studentCourseRepository.getReviews(id);
        if (!response) return null;
        const dto = mapReviewsReponseToDtoList(response)
        return dto
    }

    async createReview(formData: review): Promise<IReviewDto | null> {
        const response = await this._studentCourseRepository.createReview(formData);
        if (!response) return null;
        const dto = mapReviewReponseToDto(response);
        return dto;
    }

    async getProgress(courseId: string, userId: string): Promise<IProgressResponseDto | null> {
        const response = await this._studentCourseRepository.getProgress(courseId, userId);
        if (!response) return null;
        const dto = mapProgressToDto(response);
        return dto;
    }

    async addLectureToProgress(userId: string, courseId: string, lectureId: string): Promise<IProgressResponseDto | null> {
        const response = await this._studentCourseRepository.addLectureToProgress(userId, courseId, lectureId);
        if (!response) return null;
        const dto = mapProgressToDto(response)
        return dto;
    }


    async editReview(id: string, formData: review): Promise<IReviewResponseDto | null> {
        const response = await this._studentCourseRepository.editReview(id, formData);
        if (!response) return null;
        const dto = mapReviewToDto(response);
        return dto;
    }

    async deleteReview(id: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.deleteReview(id);
        return response
    }

    async getWishlist(userId: string): Promise<ICourseDto[] | null> {
        const courses = await this._studentCourseRepository.getWishlist(userId);
        if (!courses) return null;

        for (const course of courses) {
            if (course.imageThumbnail) {
                course.imageThumbnail = getSignedImageUrl(course.imageThumbnail);
            }
        }

        const dto = mapCoursesToDto(courses);
        return dto;
    }

    async addToWishlist(userId: string, courseId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.addToWishlist(userId, courseId);
        return response
    }

    async removeFromWishlist(userId: string, courseId: string): Promise<boolean | null> {
        const response = await this._studentCourseRepository.removeFromWishlist(userId, courseId);
        return response
    }

    async isInWishlist(userId: string, courseId: string): Promise<boolean | null> {
        return this._studentCourseRepository.isInWishlist(userId, courseId);
    }

}

export default StudentCourseService