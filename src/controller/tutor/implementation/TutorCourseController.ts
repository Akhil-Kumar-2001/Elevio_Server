import { ERROR_MESSAGES } from "../../../constants/errorMessage";
import { STATUS_CODES } from "../../../constants/statusCode";
import { Request, Response } from "express";
import ITutorCourseService from "../../../service/tutor/ITutorCourseService"
import ITutorCourseController from "../ITutorCourseController";


class TutorCourseController implements ITutorCourseController {
    private _tutorCourseService: ITutorCourseService

    constructor(tutorCourseService: ITutorCourseService) {
        this._tutorCourseService = tutorCourseService
    }

    async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const response = await this._tutorCourseService.getCategories()
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Categories retrieved Successfully", data: response })
            }
        } catch (error) {
            console.log("Error while retrieving categories:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
        }
    }

    async createCourse(req: Request, res: Response): Promise<void> {
        try {
            const courseData = req.body;

            const response = await this._tutorCourseService.createCourse(courseData);
            if (!response) {
                res.status(STATUS_CODES.CONFLICT).json({ success: false, message: "course alredy existed", data: null })
            }
            if (response) {
                res.status(STATUS_CODES.CREATED).json({ success: true, message: "Course created Successfully", data: response })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getCourses(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const { tutorId } = req.query;

            if (!tutorId) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Tutor ID is required" });
                return
            }


            const response = await this._tutorCourseService.getCourses(tutorId as string, page, limit);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Courses retrieved successfully", data: response })
        } catch (error) {
            console.log("Error fetching courses", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching Courses" });
        }
    }

    async getCourseDetails(req: Request, res: Response): Promise<void> {
        try {
            const id = (req.query.id as string);
            const response = await this._tutorCourseService.getCourseDetails(id);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Course details retrieved successfully", data: response })
        } catch (error) {
            console.log("Error fetching courses", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error fetching Course details" });
        }
    }

    async editCourse(req: Request, res: Response): Promise<void> {
        try {
            const { id, editedCourse } = req.body;
            const response = this._tutorCourseService.editCourse(id, editedCourse);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Course details updated successfully", data: response })
        } catch (error) {
            console.log("Error editing course details", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error editing Course details" });
        }
    }

    async createSection(req: Request, res: Response): Promise<void> {
        try {
            const { id, sectionData } = req.body;

            // Log the raw id to debug
            console.log("Raw ID received:", id);

            // Extract the courseId if id is an object
            const courseId = typeof id === 'string' ? id : id?.id;

            console.log("this is course id:===>>", courseId);
            console.log("this is the section data ===>", sectionData);

            if (!courseId) {
                res.status(STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    message: "Course id is required to create section in backend",
                    data: null,
                });
                return;
            }

            const response = await this._tutorCourseService.createSection(courseId, sectionData);
            if (response) {
                res.status(STATUS_CODES.CREATED).json({
                    success: true,
                    message: "Section created Successfully",
                    data: response,
                });
            } else {
                res.status(STATUS_CODES.NOT_FOUND).json({
                    success: false,
                    message: "Course not found",
                    data: null,
                });
            }
        } catch (error) {
            console.log("Error while creating the Section", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Error while creating Section",
            });
        }
    }

    async createLecture(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;
            if (!data) {
                console.log("🚨 No data received from frontend");
                res.status(STATUS_CODES.NOT_FOUND).json({ success: false, message: ERROR_MESSAGES.NOT_FOUND, data: null });
                return;
            }

            const response = await this._tutorCourseService.createLecture(data);

            if (!response) {
                res.status(STATUS_CODES.BAD_REQUEST).json({ success: false, message: "Failed to create lecture" });
                return;
            }

            res.status(STATUS_CODES.CREATED).json({
                success: true,
                message: "Lecture created Successfully",
                data: response,
            });

        } catch (error) {
            console.log("🚨 Error in controller:", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while creating Lecture" });
        }
    }

    async getSections(req: Request, res: Response): Promise<void> {
        try {
            const id = (req.query.id as string);
            const response = await this._tutorCourseService.getSections(id)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Section retrieved successfully", data: response })

        } catch (error) {
            console.log("Error while fetching Sections")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Sections" });

        }
    }

    async getLectures(req: Request, res: Response): Promise<void> {
        try {
            const id = (req.query.id as string);
            const response = await this._tutorCourseService.getLectures(id)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Lectures retrieved successfully", data: response })
        } catch (error) {
            console.log("Error while fetching Lectures")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Lectures" });
        }
    }

    async editLecture(req: Request, res: Response): Promise<void> {
        try {
            let title = req.body.title;
            let id = req.params.id
            console.log(title, id)
            const response = await this._tutorCourseService.editLecture(id, title);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Lecure updated successfully", data: response })
        } catch (error) {
            console.log(error);
        }
    }

    async deleteLecture(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id
            const response = await this._tutorCourseService.deleteLecture(id);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Lecture deleted successfully", data: response })
        } catch (error) {
            console.log(error);
        }
    }

    async editSection(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const data = req.body;
            const response = await this._tutorCourseService.editSection(id, data)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Section updated successfully", data: response })
        } catch (error) {
            console.log("Error while editing Section")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while editing section" });
        }
    }

    async uploadLectureVideo(req: Request, res: Response): Promise<void> {
        try {
            const lectureId = req.body.lectureId;
            const videoFile = req.file; // File uploaded via multer

            if (!lectureId || !videoFile) {
                res.status(400).json({ message: 'lectureId and video file are required' });
                return;
            }

            const videoUrl = await this._tutorCourseService.uploadLectureVideo(lectureId, videoFile);
            res.status(200).json({ videoUrl });
        } catch (error) {
            console.error('Error in uploadLectureVideo:', error);
            res.status(500).json({ message: 'Failed to upload video' });
        }
    }

    async applyReview(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.body
            let response = await this._tutorCourseService.applyReview(courseId);
            if (response) {
                res.status(STATUS_CODES.OK).json({ success: true, message: "Apply for Course Review Successfully", data: null })
            }
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getNotifications(req: Request, res: Response): Promise<void> {
        try {
            const receiverId = req.userId;
            const response = await this._tutorCourseService.getNotifications(receiverId as string);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Notifications retrieved Successfully", data: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async readNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            console.log("notification id", id)
            const response = await this._tutorCourseService.readNotifications(id);;
            console.log("response after read notification in the controller", response)
            res.status(STATUS_CODES.OK).json({ success: true, message: "Notifications read Successfully", data: response })
        } catch (error) {
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getStudents(req: Request, res: Response): Promise<void> {
        try {
            const tutorId = req.userId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const response = await this._tutorCourseService.getStudents(tutorId as string,page,limit);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Students retrieved Successfully", data: response })
        } catch (error) {
            console.log("Error while fetching students", error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR, data: null })
        }
    }

    async getCoursePreview(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const response = await this._tutorCourseService.getCoursePreview(courseId as string);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Course details retrieved successfully", data: response })
        } catch (error) {
            console.log("Error while fetching Course Preview")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Course Preview" });
        }
    }

    async getSectionsPreview(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const response = await this._tutorCourseService.getSectionsPreview(courseId as string);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Sections details retrieved successfully", data: response })
        } catch (error) {
            console.log("Error while fetching Sections")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Sections" });

        }
    }

    async getLecturesPreview(req: Request, res: Response): Promise<void> {
        try {
            const { sectionId } = req.params;
            const response = await this._tutorCourseService.getLecturesPreview(sectionId as string);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Lecture details retrieved successfully", data: response })
        } catch (error) {
            console.log("Error while fetching Lecture Preview")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Lecture Preview" });
        }
    }

    async getReviews(req: Request, res: Response): Promise<void> {
        try {
            const { courseId } = req.params;
            const response = await this._tutorCourseService.getReviews(courseId as string);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Reviews details retrieved successfully", data: response })
        } catch (error) {
            console.log("Error while fetching Reviews")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while fetching Reviews" });
        }
    }

    async replyReview(req: Request, res: Response): Promise<void> {
        try {
            const { reviewId } = req.params;
            const { reply } = req.body;
            const response = await this._tutorCourseService.replyReview(reviewId as string, reply);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Reply to review sent successfully", data: response })
        } catch (error) {
            console.log("Error while replying to review")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while replying to review" });
        }
    }

    async deleteReply(req: Request, res: Response): Promise<void> {
        try {
            const { reviewId } = req.params;
            const response = await this._tutorCourseService.deleteReply(reviewId as string);
            res.status(STATUS_CODES.OK).json({ success: true, message: "Reply deleted successfully", data: response })
        } catch (error) {
            console.log("Error while deleting reply")
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error while deleting reply" });
        }
    }


}

export default TutorCourseController