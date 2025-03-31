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
            console.log("purchased course", response)
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
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Lectures" });
        }
    }

}

export default StudentCourseController