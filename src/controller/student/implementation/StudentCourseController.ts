import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../../../constants/errorMessage";
import { STATUS_CODES } from "../../../constants/statusCode";
import IStudentCourseService from "../../../service/student/IStudentCourseService";
import IStudentCourseController from "../IStudentCourseController";

class StudentCourseController implements IStudentCourseController {

    private _studentCourseService: IStudentCourseService;

    constructor(studentCourseService: IStudentCourseService) {
        this._studentCourseService = studentCourseService;
    }

    async getListedCourse(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._studentCourseService.getListedCourse();
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Listed course Retrieved successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })

        }
    }

    async getTopRatedCourse(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._studentCourseService.getTopRatedCourse();
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Listed course Retrieved successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })

        }
    }

    async addToCart(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.body.userId;
            const isPurchased = await this._studentCourseService.isPurchased(id, userId);
            if (isPurchased) {
                res.status(STATUS_CODES.CONFLICT).json({ success: true, message: "Course Already Purchased", data: isPurchased })
                return
            }
            const courseExist = await this._studentCourseService.courseExist(id, userId);
            if (courseExist) {
                res.status(STATUS_CODES.CONFLICT).json({ success: true, message: "Course Already exist On Cart", data: courseExist })
                return

            }
            const response = await this._studentCourseService.addToCart(id, userId);
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Add To Cart Successfully", data: response })
            }

        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })

        }
    }

    async getCart(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._studentCourseService.getCart(id);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Retrived cart details successfully", data: response ?? {} })

        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })

        }
    }

    async removeItem(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const studentId = req.query.studentId as string;
            console.log(studentId)
            const response = await this._studentCourseService.removeItem(id, studentId)
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Course Removed from cart successfully", data: response })

            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })

        }
    }

    async createOrder(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, amount, courseIds } = req.body;
            if (!studentId || !amount || !courseIds) {
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.NOT_FOUND, data: null })
                return
            }

            const response = await this._studentCourseService.createOrder(studentId, amount, courseIds);
            res.status(STATUS_CODES.CREATED).json({ success: true, message: "Order created successfully", data: response })



        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async verifyPayment(req: Request, res: Response): Promise<void> {
        console.log("Request data for verfiy payment", req.body)
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const response = await this._studentCourseService.verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            console.log("controlelr response", response)
            res.status(response == "success" ? STATUS_CODES.OK : STATUS_CODES.BAD_REQUEST).json({ success: response === "success", message: response === "success" ? "Payment successful" : "Payment failed", status: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._studentCourseService.getCategories();
            res.status(STATUS_CODES.OK).json({ success: true, message: "Categories retrieved true", data: response });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getCourses(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 8;
            const response = await this._studentCourseService.getCourses(page, limit);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Courses retrieved successfully", data: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getPurchasedCourses(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._studentCourseService.getPurchasedCourses(id as string);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Purchased courses retrieved successfully", data: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getCourse(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const response = await this._studentCourseService.getCourse(id as string);
        res.status(STATUS_CODES.OK).json({ success: true, message: "Course details retrieved successfully", data: response })
    }

    async getTutor(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const response = await this._studentCourseService.getTutor(id as string);
        res.status(STATUS_CODES.OK).json({ success: true, message: "Tutor details retrieved successfully", data: response })
    }

    async getSections(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            console.log(courseId)
            const response = await this._studentCourseService.getSections(courseId)
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Sections retrieved Successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });

        }
    }


    async getLectures(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const response = await this._studentCourseService.getLectures(courseId)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Lectures retrieved successfully", data: response })
        } catch (error) {
            console.log("Error while fetching Lectures")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async getSubscription(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._studentCourseService.getSubscription();
            res.status(STATUS_CODES.OK).json({ success: true, message: "Subscription retrieved successfully", data: response });
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async createSubscritionOrder(req: Request, res: Response): Promise<void> {
        try {
            const { studentId, amount, planId } = req.body;
            if (!studentId || !amount || !planId) {
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.NOT_FOUND, data: null })
                return
            }

            const validplan = await this._studentCourseService.isValidPlan(studentId);
            if(validplan){
                res.status(STATUS_CODES.CONFLICT).json({success:false,message:"You are currently in an active plan. Unable to purchase new plan!",data:null})
                return
            }

            const response = await this._studentCourseService.createSubscritionOrder(studentId, amount, planId);
            res.status(STATUS_CODES.CREATED).json({ success: true, message: "Order created successfully", data: response })



        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async verifySubscriptionPayment(req: Request, res: Response): Promise<void> {
        console.log("Request data for verfiy sub payment", req.body)
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const response = await this._studentCourseService.verifySubscriptionPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            console.log("controlelr response", response)
            res.status(response == "paid" ? STATUS_CODES.OK : STATUS_CODES.BAD_REQUEST).json({ success: response === "paid", message: response === "paid" ? "Payment successful" : "Payment failed", status: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }
    
    async getReviews(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params ;
            const response = await this._studentCourseService.getReviews(id);
            res.status(STATUS_CODES.OK).json({success:true,message:"Review retrieved successfully",data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }
    
    async createReview(req: Request, res: Response): Promise<void> {
        try {
            const { formData } = req.body
            console.log("form data",formData)
            const response = await this._studentCourseService.createReview(formData);
            if(response){
                res.status(STATUS_CODES.CREATED).json({success:true,message:"Review added Successfully",data:response});
            }else{
                res.status(STATUS_CODES.CONFLICT).json({success:false,message:"Alread Give review to this course",data:response})
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getProgress(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const userId = req.userId as string;
            const response = await this._studentCourseService.getProgress(id,userId );
            res.status(STATUS_CODES.OK).json({success:true,message:"progress get Successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
        }
    }

    async addLectureToProgress(req: Request, res: Response): Promise<void> {
        try {
            const {courseId,lectureId} = req.body;
            const userId = req.userId as string;
            const response = await this._studentCourseService.addLectureToProgress(userId,courseId,lectureId);
            res.status(STATUS_CODES.OK).json({success:true,message:"progress updated Successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
        }
    }

    async editReview(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const {formData} = req.body;
            const response = await this._studentCourseService.editReview(id,formData);
            res.status(STATUS_CODES.OK).json({success:true,message:"Review updated Successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
        }
    }

    async deleteReview(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const response = await this._studentCourseService.deleteReview(id);
            res.status(STATUS_CODES.OK).json({success:true,message:"Review deleted Successfully",data:response});
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null });
        }
    }

    async getWishlist(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.userId as string;
            const response = await this._studentCourseService.getWishlist(userId);
            console.log("Wishlist response",response)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Wishlist retrieved successfully", data: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }
    async addToWishlist(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.userId;
            const isInWishlist = await this._studentCourseService.isInWishlist( userId as string,id);
            console.log("isInWishlist",isInWishlist)
            if (isInWishlist) { 
                res.status(STATUS_CODES.CONFLICT).json({ success: true, message: "Course Already exist On Wishlist", data: isInWishlist })
                return
            }
            const response = await this._studentCourseService.addToWishlist( userId as string,id);
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Add To Wishlist Successfully", data: response })
            }

        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })

        }
    }
    async removeFromWishlist(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const studentId = req.userId as string;
            console.log(studentId)
            const response = await this._studentCourseService.removeFromWishlist( studentId,id)
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Course Removed from Wishlist successfully", data: response })

            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })

        }
    }

}

export default StudentCourseController