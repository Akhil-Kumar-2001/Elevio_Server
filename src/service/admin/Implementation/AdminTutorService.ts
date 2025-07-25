import { getIO, getReceiverSocketId } from "../../../Config/socketConfig";
import { ICategoryDto } from "../../../dtos/category/categoryDto";
import { ICourseDto } from "../../../dtos/course/courseDto";
import { ILectureDto } from "../../../dtos/lecture/ILectureDto";
import { ISectionDto } from "../../../dtos/section/ISectionDto";
import { ISubscriptionDto } from "../../../dtos/subsription/subscriptionDto";
import { ITutorDto } from "../../../dtos/tutor/tutorDto";
import { ITutorWalletDto } from "../../../dtos/wallet/tutorwallet/tutorWalletDto";
import { mapCategoriesToDto, mapCategoryToDto } from "../../../mapper/category/categoryMapper";
import { mapCoursesToDto, mapCourseToDto } from "../../../mapper/course/courseMapper";
import { mapLecturesToDto } from "../../../mapper/lecture/lectureMapper";
import { MapToSectionsDto } from "../../../mapper/section/sectionMapper";
import { mapSubscriptionsToDto } from "../../../mapper/subscription/subscriptionMapper";
import { mapTutorsToDto, mapTutorToDto } from "../../../mapper/tutor/tutorMapper";
import { mapTutorWalletsToPaginatedDto } from "../../../mapper/wallet/tutorwallet/tutorWalletMapper";
import { ICategory } from "../../../model/category/categoryModel";
import { ICourse } from "../../../model/course/courseModel";
import { ILecture } from "../../../model/lecture/lectureModel";
import { ISection } from "../../../model/section/sectionModel";
import { ISubscription } from "../../../model/subscription/subscriptionModel";
import { ITutor } from "../../../model/tutor/tutorModel";
import { ITutorWallet } from "../../../model/wallet/walletModel";
import IAdminTutorRepository from "../../../repository/admin/IAdminTutorRepository";
import { ISubscriptionPlan } from "../../../Types/basicTypes";
import { PaginatedResponse } from "../../../Types/CategoryReturnType";
import IAdminTutorService from "../IAdminTutorService";

class AdminTutorService implements IAdminTutorService {

    private _adminTutorRepository: IAdminTutorRepository;

    constructor(adminTutorRepository: IAdminTutorRepository) {
        this._adminTutorRepository = adminTutorRepository;

    }
    async getPendingTutors(page: number, limit: number): Promise<PaginatedResponse<ITutorDto> | null> {
        const tutors = await this._adminTutorRepository.getPendingTutors(page, limit);
        if (!tutors) return null;
        const dto = mapTutorsToDto(tutors.data as ITutor[])
        return { data: dto, totalRecord: tutors.totalRecord }
    }
    async getTutorById(id: string): Promise<ITutorDto | null> {
        const tutor = await this._adminTutorRepository.getTutorById(id);
        if (!tutor) return null;
        const dto = mapTutorToDto(tutor as ITutor);
        return dto
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

    async getCategories(page: number, limit: number): Promise<PaginatedResponse<ICategoryDto> | null> {
        const categories = await this._adminTutorRepository.getCategories(page, limit);
        return categories
    }

    async blockCategory(id: string): Promise<ICategoryDto | null> {
        const response = await this._adminTutorRepository.blockCategory(id);
        return response
    }

    async deleteCategory(id: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.deleteCategory(id);
        return response
    }

    async pendingCourse(page: number, limit: number): Promise<PaginatedResponse<ICourseDto> | null> {
        const response = await this._adminTutorRepository.pendingCourse(page, limit);

        if (!response) return null;

        const dto = mapCoursesToDto(response.courses)
        return { data: dto, totalRecord: response.totalRecord }
    }


    async getCategory(): Promise<ICategoryDto[] | null> {
        const categories = await this._adminTutorRepository.getCategory();
        const dto = mapCategoriesToDto(categories as ICategory[])
        return dto
    }

    async courseDetails(id: string): Promise<ICourseDto | null> {
        const course = await this._adminTutorRepository.courseDetails(id);
        const dto = mapCourseToDto(course as ICourse)
        return dto;
    }

    async getCategoryName(id: string): Promise<string | null> {
        const response = await this._adminTutorRepository.getCategoryName(id);
        return response;
    }

    async getSections(id: string): Promise<ISectionDto[] | null> {
        const sections = await this._adminTutorRepository.getSections(id);
        const dto = MapToSectionsDto(sections as ISection[])
        return dto;
    }

    async getLectures(id: string): Promise<ILectureDto[] | null> {
        const response = await this._adminTutorRepository.getLectures(id);
        const dto = mapLecturesToDto(response as ILecture[])
        return dto
    }

    async rejectCourse(id: string, reason: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.rejectCourse(id, reason);
        if (response) {
            const receiverSocketId = getReceiverSocketId(response.receiverId.toString());
            const io = getIO();
            if (receiverSocketId && io) {
                io.to(receiverSocketId).emit("newNotification", response)
            }
        }
        if (response) {
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

    async getSubscription(page: number, limit: number): Promise<PaginatedResponse<ISubscriptionDto> | null> {
        const response = await this._adminTutorRepository.getSubscription(page, limit);
        if (!response) return null;
        const dto = mapSubscriptionsToDto(response?.subscriptions as ISubscription[])
        return { data: dto, totalRecord: response?.totalRecord };
    }

    async createSubscription(data: ISubscriptionPlan): Promise<boolean | null> {
        const response = await this._adminTutorRepository.createSubscription(data);
        return response
    }

    async editSubscription(data: ISubscriptionPlan): Promise<boolean | null> {
        const response = await this._adminTutorRepository.editSubscription(data);
        return response
    }

    async deleteSubscription(id: string): Promise<boolean | null> {
        const response = await this._adminTutorRepository.deleteSubscription(id);
        return response
    }

    async getTutorsWalltes(page: number, limit: number): Promise<PaginatedResponse<ITutorWalletDto> | null> {
        const wallets = await this._adminTutorRepository.getTutorsWalltes(page, limit);
        if (!wallets) return null;
        return mapTutorWalletsToPaginatedDto(wallets.wallets as ITutorWallet[], wallets.totalRecord);
    }

    async getTutorsList(): Promise<ITutorDto[] | null> {
        const tutors = await this._adminTutorRepository.getTutorsList();
        const dto = mapTutorsToDto(tutors as ITutor[])
        return dto
    }
}

export default AdminTutorService