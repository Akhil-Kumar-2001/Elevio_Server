import { ERROR_MESSAGES } from '../../../constants/errorMessage';
import { STATUS_CODES } from '../../../constants/statusCode';
import IAdminTutorService from "../../../service/admin/IAdminTutorService";
import { Request, Response } from "express"; //
import MailUtility from '../../../utils/mailUtility';
import IAdminTutorController from '../IAdminTutorController';



class AdminTutorController implements IAdminTutorController {

    private _adminTutorService: IAdminTutorService;

    constructor(adminTutorService: IAdminTutorService) {
        this._adminTutorService = adminTutorService;
    }

    async getPendingTutors(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const tutors = await this._adminTutorService.getPendingTutors(page,limit);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Pending tutors Retrived", data: tutors })
        } catch (error) {
            console.error("Error while retriving Tutors data.", error);
            res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Tutors data Retrived failed", data: null });
            return;
        }
    }

    async getTutor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            console.log("entered get tutor")
            if (!id) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ error: ERROR_MESSAGES.BAD_REQUEST });
            }
            const tutor = await this._adminTutorService.getTutorById(id);
            if (!tutor) {
                res.status(STATUS_CODES.NOT_FOUND).json({ error: ERROR_MESSAGES.NOT_FOUND });
                return
            }
            res.status(STATUS_CODES.OK).json({ success: true, message: "Tutor found ", data: tutor })
        } catch (error) {
            console.log(error)
        }
    }

    async rejectTutor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const response = await this._adminTutorService.rejectTutor(id)
            if (!response) {
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.NOT_FOUND, data: null })
                return
            }
            res.status(STATUS_CODES.OK).json({ success: true, message: "Tutor rejected successfully", data: response })
        } catch (error) {
            console.log(error)
        }
    }

    async approveTutor(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const response = await this._adminTutorService.approveTutor(id)
            if (!response) {
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.NOT_FOUND, data: null })
                return
            }
            res.status(STATUS_CODES.OK).json({ success: true, message: "Tutor approved successfully", data: response })
        } catch (error) {
            console.log(error)
        }
    }

    async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            console.log("category name", name)
            const category = await this._adminTutorService.findCategory(name)
            console.log("is category exist", category)
            if (category) {
                res.status(STATUS_CODES.CONFLICT).json({ success: false, message: "Category already exists", data: null })
            } else {
                const response = await this._adminTutorService.createCategory(name)
                console.log("is category created", response)
                res.status(STATUS_CODES.CREATED).json({ success: true, message: "Category created Successfully", data: response })

            }

        } catch (error) {
            console.log(error)
        }
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            const response = await this._adminTutorService.getCategories(page, limit);

            res.status(STATUS_CODES.OK).json({
                success: true,
                message: "Categories retrieved successfully",
                data: response
            });
        } catch (error) {
            console.error("Error fetching categories", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching categories" });
        }
    }

    async blockCategory(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body
            const response = await this._adminTutorService.blockCategory(id);
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Change status success", data: response })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const id = req.body.id;
            console.log("id from delete category backend", id)
            const response = await this._adminTutorService.deleteCategory(id);
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Category deleted Successfully", data: response })
            }
        } catch (error) {
            console.log(error)
        }
    }

    async pendingCourse(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const courses = await this._adminTutorService.pendingCourse(page,limit);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Pending Courses Retrived", data: courses })
        } catch (error) {
            res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Courses data Retrived failed", data: null });
        }
    }

    async getCategory(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._adminTutorService.getCategory()
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Categories retrieved Successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async courseDetails(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params
            console.log(id)
            const response = await this._adminTutorService.courseDetails(id)
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Course details retrieved Successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });

        }
    }
    async getSections(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            console.log(id)
            const response = await this._adminTutorService.getSections(id)
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Sections retrieved Successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });

        }
    }

    async getLectures(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const response = await this._adminTutorService.getLectures(id)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Lectures retrieved successfully", data: response })
        } catch (error) {
            console.log("Error while fetching Lectures")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Lectures" });
        }
    }

    async rejectCourse(req:Request,res:Response):Promise<void> {
        try {
            const {id} = req.params;
            const reason = req.body.reason
            const tutorId = req.body.tutorId
            console.log("==================>",tutorId)
            const email = await this._adminTutorService.getTutorMail(tutorId);
            // console.log(object)
            const response = await this._adminTutorService.rejectCourse(id,reason)
            if (!response) {
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.NOT_FOUND, data: null })
                return
            }
            if (response && email) {
                await MailUtility.sendMail(email, reason, "Course Rejection");
            } else if (!email) {
                console.log("Email not found for tutor, skipping email notification");
            }
            res.status(STATUS_CODES.OK).json({ success: true, message: "Course rejected successfully", data: response })
 
        } catch (error) {
            console.log("Error while rejecting Course")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while Rejecting course" });
        }
    }

    async approveCourse(req:Request,res:Response):Promise<void> {
        try {
            const {id} = req.params;
            console.log("==================>",id)
            const response = await this._adminTutorService.approveCourse(id)
            if (!response) {
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.NOT_FOUND, data: null })
                return
            }
            res.status(STATUS_CODES.OK).json({ success: true, message: "Course approved successfully", data: response })

        } catch (error) {
            console.log("Error while rejecting Course")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while Rejecting course" });
        }
    }

    async getSubscription(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 3;
            const response = await this._adminTutorService.getSubscription(page,limit);
            res.status(STATUS_CODES.OK).json({ success: false, message: "Subscription retrieved successfully" , data: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });

        }
    }

    async createSubscription(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            const response = await this._adminTutorService.createSubscription(data);
            res.status(STATUS_CODES.CREATED).json({success:true, message:"Subscription created successfully", data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });       
        }
    }

    async editSubscription(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            console.log("Edited data",data)
            const response = await this._adminTutorService.editSubscription(data);
            res.status(STATUS_CODES.OK).json({success:true, message:"Subscription Edited successfully", data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });       
        }
    }

    async deleteSubscription(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            console.log("Edited data",id)
            const response = await this._adminTutorService.deleteSubscription(id);
            res.status(STATUS_CODES.OK).json({success:true, message:"Subscription Edited successfully", data:response})
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });       
        }
    }
}



export default AdminTutorController