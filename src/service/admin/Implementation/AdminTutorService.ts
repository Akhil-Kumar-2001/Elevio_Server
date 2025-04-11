import { getIO, getReceiverSocketId } from "../../../Config/socketConfig";
import { ICategory } from "../../../model/category/categoryModel";
import { ICourse } from "../../../model/course/courseModel";
import { ILecture } from "../../../model/lecture/lectureModel";
import { ISection } from "../../../model/section/sectionModel";
import { ISubscription } from "../../../model/subscription/subscriptionModel";
import { ITutor } from "../../../model/tutor/tutorModel";
import IAdminTutorRepository from "../../../repository/admin/IAdminTutorRepository";
import { ISubscriptionPlan } from "../../../Types/basicTypes";
import { CategoryResponseDataType, CourseResponseDataType, SubscriptionResponseDataType, TutorResponseDataType } from "../../../Types/CategoryReturnType";
import IAdminTutorService from "../IAdminTutorService";

class AdminTutorService implements IAdminTutorService {

    private _adminTutorRepository: IAdminTutorRepository;

    constructor(adminTutorRepository: IAdminTutorRepository) {
        this._adminTutorRepository = adminTutorRepository;

    }
    async getPendingTutors(page:number,limit:number): Promise<TutorResponseDataType | null> {
        const tutors = await this._adminTutorRepository.getPendingTutors(page,limit);
        return tutors
    }
    async getTutorById(id: string): Promise<ITutor | null> {
        const tutor = await this._adminTutorRepository.getTutorById(id);
        return tutor
    }

    async rejectTutor(id: string): Promise<boolean | null> {
        const reject = await this._adminTutorRepository.rejectTutor(id)
        return reject
    }

    async approveTutor(id: string): Promise<boolean | null> {
        const approve = await this._adminTutorRepository.approveTutor(id)
        return approve
    }

    async findCategory(name: string): Promise<boolean | null> {
        const category = await this._adminTutorRepository.findCategory(name);
        return category
    }

    async createCategory(name: string): Promise<boolean | null> {
        const category = await this._adminTutorRepository.createCategory(name);
        return category
    }

    async getCategories(page: number, limit: number): Promise<CategoryResponseDataType | null> {
        const categories = await this._adminTutorRepository.getCategories(page, limit);
        return categories
    }

    async blockCategory(id: string): Promise<ICategory | null> {
        const response = await this._adminTutorRepository.blockCategory(id);
        return response
    }

    async deleteCategory(id: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.deleteCategory(id);
        return response
    }

    async pendingCourse(page:number,limit:number): Promise<CourseResponseDataType | null> {
        const response = await this._adminTutorRepository.pendingCourse(page,limit);
        return response
    }


    async getCategory(): Promise<ICategory[] | null> {
        const categories = await this._adminTutorRepository.getCategory();
        return categories
    }

    async courseDetails(id: string): Promise<ICourse | null> {
        const course = await this._adminTutorRepository.courseDetails(id);
        return course;
    }

    async getCategoryName(id: string): Promise<string | null> {
        const response = await this._adminTutorRepository.getCategoryName(id);
        return response;    
    }

    async getSections(id: string): Promise<ISection[] | null> {
        const sections = await this._adminTutorRepository.getSections(id);
        return sections;
    }

    async getLectures(id: string): Promise<ILecture[] | null> {
        const response = await this._adminTutorRepository.getLectures(id);
        return response
    }

    async rejectCourse(id: string, reason: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.rejectCourse(id,reason);
            if (response) {
                const receiverSocketId = getReceiverSocketId(response.receiverId.toString());
                const io = getIO();
                if (receiverSocketId && io) {
                    io.to(receiverSocketId).emit("newNotification", response)
                }
            }
        if(response){
            return true
        }
        return null;
    }

    async getTutorMail(tutorId: string): Promise<string | null> {
        const email = await this._adminTutorRepository.getTutorMail(tutorId)
        return email
    }

    async approveCourse(id: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.approveCourse(id);
        return response;
    }

    async getSubscription(page:number,limit:number): Promise<SubscriptionResponseDataType | null> {
        const response = await this._adminTutorRepository.getSubscription(page,limit);
        return response;
    }

    async createSubscription(data: ISubscriptionPlan): Promise<boolean | null> {
        const response = await this._adminTutorRepository.createSubscription(data);
        return response
    }

    async editSubscription(data: ISubscriptionPlan): Promise<boolean | null> {
        const response = await this._adminTutorRepository.editSubscription(data);
        return response
    }

    async deleteSubscription(id:string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.deleteSubscription(id);
        return response
    }
}

export default AdminTutorService