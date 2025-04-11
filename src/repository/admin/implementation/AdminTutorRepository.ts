import { Category, ICategory } from '../../../model/category/categoryModel';
import { Course, ICourse } from '../../../model/course/courseModel';
import { ILecture, Lecture } from '../../../model/lecture/lectureModel';
import { INotification, Notification } from '../../../model/notification/notification.Model';
import { ISection, Section } from '../../../model/section/sectionModel';
import Subscription, { ISubscription } from '../../../model/subscription/subscriptionModel';
import { ITutor, Tutor } from '../../../model/tutor/tutorModel';
import { ISubscriptionPlan } from '../../../Types/basicTypes';
import { CategoryResponseDataType, CourseResponseDataType, SubscriptionResponseDataType, TutorResponseDataType } from '../../../Types/CategoryReturnType';
import IAdminTutorRepository from '../IAdminTutorRepository'

class AdminTutorRepository implements IAdminTutorRepository {
    async getPendingTutors(page: number, limit: number): Promise<TutorResponseDataType | null> {
        const skip = (page - 1) * limit;
        const tutors = await Tutor.find({ isVerified: "pending" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
        const totalRecord = await Tutor.countDocuments()
        return { tutors, totalRecord };
    }

    async getTutorById(id: string): Promise<ITutor | null> {
        const tutor = await Tutor.findById(id);
        return tutor;
    }

    async rejectTutor(id: string): Promise<boolean | null> {
        try {
            const tutor = await Tutor.findByIdAndUpdate(
                id,
                {
                    isVerified: "not_verified",
                    profile: {
                        skills: [],
                        documents: [],
                        experience: "",
                        bio: "",
                        qualification: ""
                    }
                },
                { new: true }
            );

            return tutor ? true : null;
        } catch (error) {
            console.error("Error rejecting tutor verification:", error);
            return null;
        }
    };

    async approveTutor(id: string): Promise<boolean | null> {
        try {
            const tutor = await Tutor.findByIdAndUpdate(
                id,
                { isVerified: "verified" },
                { new: true }
            );

            return tutor ? true : null;
        } catch (error) {
            console.error("Error approving tutor verification:", error);
            return null;
        }
    };

    async findCategory(name: string): Promise<boolean> {
        try {
            const category = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
            return !!category;
        } catch (error) {
            console.log("Error finding category:", error);
            return false;
        }
    }
    async createCategory(name: string): Promise<boolean> {
        try {
            const newCategory = new Category({ name });
            await newCategory.save();
            return true;
        } catch (error) {
            console.log("Error creating category:", error);
            return false;
        }
    }

    async getCategories(page: number, limit: number): Promise<CategoryResponseDataType | null> {
        try {
            const skip = (page - 1) * limit;
            const categories = await Category.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
            const totalRecord = await Category.countDocuments()
            return { categories, totalRecord }
        } catch (error) {
            console.log("Error while retrieving categories")
            return null
        }
    }

    async blockCategory(id: string): Promise<ICategory | null> {
        const category = await Category.findById(id, { status: 1 })
        const newStatus = category?.status === 1 ? -1 : 1
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true } // Returns the updated document
        );
        return updatedCategory
    }

    async deleteCategory(id: string): Promise<boolean> {
        try {
            const deletedCategory = await Category.findByIdAndDelete(id);
            return deletedCategory ? true : false;
        } catch (error) {
            console.log("Error deleting category:", error);
            return false;
        }
    }

    async pendingCourse(page: number, limit: number): Promise<CourseResponseDataType | null> {

        const skip = (page - 1) * limit;
        const courses = await Course.find({ status: "pending" })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .exec();
        const totalRecord = await Course.countDocuments()
        return { courses, totalRecord }
    }

    async getCategory(): Promise<ICategory[] | null> {
        const categories = await Category.find();
        return categories
    }

    async courseDetails(id: string): Promise<ICourse | null> {
        const course = Course.findOne({ _id: id })
        return course;
    }

    async getCategoryName(id: string): Promise<string | null> {
        const category = await Category.findOne({_id:id});
        return  category?.name ?? null

    }

    async getSections(id: string): Promise<ISection[] | null> {
        try {
            const sections = await Section.find({ courseId: id })
            return sections
        } catch (error) {
            console.log("Error while getting Sections");
            return null
        }
    }

    async getLectures(id: string): Promise<ILecture[] | null> {
        try {
            const lectures = await Lecture.find({ sectionId: id })
            return lectures
        } catch (error) {
            console.log("Error while retrieving Sections ");
            return null
        }
    }

    async rejectCourse(id: string, reason: string): Promise<INotification | null> {
        try {
            const course = await Course.findByIdAndUpdate(
                id,
                {
                    status: "rejected",
                    rejectedReason: reason
                },
                { new: true }
            );

            if (course) {
                // Create a notification for the tutor
                const notification = await Notification.create({
                    receiverId: course.tutorId,
                    content: `Your course "${course.title}" has been rejected. Reason: ${reason}`,
                });

                return notification;
            } else {
                return null;
            }
        } catch (error) {
            console.log("Error while rejecting course verification:", error);
            return null;
        }
    }

    async getTutorMail(tutorId: string): Promise<string | null> {
        try {
            const tutor = await Tutor.findOne({ _id: tutorId })
            if (!tutor) {
                console.log("Tutor not found for ID:", tutorId);
                return null;
            }
            const email = tutor.email;
            return email;

        } catch (error) {
            console.log("Error while getting email of tutor:", error);
            return null;
        }
    }

    async approveCourse(id: string): Promise<boolean | null> {
        try {
            const course = await Course.findByIdAndUpdate(
                id,
                { status: "accepted" },
                { new: true }
            );
            return course ? true : false
        } catch (error) {
            console.error("Error while approving course verification:", error);
            return null;
        }
    }

    async getSubscription(page: number, limit: number): Promise<SubscriptionResponseDataType | null> {
        try {
            const skip = (page - 1) * limit;
            const subscriptions = await Subscription.find()
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalRecord = await Subscription.countDocuments()
            console.log("total record suscription",totalRecord);

            return { subscriptions, totalRecord }
            // return subscriptions ?? null;
        } catch (error) {
            console.error("Error while approving course verification:", error);
            return null;
        }
    }

    async createSubscription(data: ISubscriptionPlan): Promise<boolean | null> {
        // Create a new subscription document
        const newSubscription = new Subscription({
            planName: data.planName,
            duration: {
                value: data.duration.value,
                unit: data.duration.unit
            },
            price: data.price,
            features: data.features,
            status: data.status
        });

        // Save the subscription to the database
        await newSubscription.save();

        return newSubscription ? true : null
    }

    async editSubscription(data: ISubscription): Promise<boolean | null> {
        try {
            const updatedSubscription = await Subscription.findByIdAndUpdate(
                data._id,
                {
                    $set: {
                        planName: data.planName,
                        duration: data.duration,
                        price: data.price,
                        features: data.features,
                        status: data.status,
                        updatedAt: new Date()
                    }
                },
                { new: true } // Returns the updated document
            );

            return updatedSubscription ? true : null;
        } catch (error) {
            console.error("Error updating subscription:", error);
            return null;
        }
    }

    async deleteSubscription(id: string): Promise<boolean | null> {
        const response = await Subscription.findByIdAndDelete({ _id: id });
        return response ? true : null;
    }
}

export default AdminTutorRepository