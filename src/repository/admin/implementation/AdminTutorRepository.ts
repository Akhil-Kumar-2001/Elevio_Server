import { Category, ICategory } from '../../../model/category/categoryModel';
import { ITutor, Tutor } from '../../../model/tutor/tutorModel';
import { CategoryResponseDataType } from '../../../Types/CategoryReturnType';
import IAdminTutorRepository from '../IAdminTutorRepository'

class AdminTutorRepository implements IAdminTutorRepository {
    async getPendingTutors(): Promise<ITutor[] | null> {
        return await Tutor.find({ isVerified: "pending" });
    }

    async getTutorById(id: string): Promise<ITutor | null> {
        const tutor = await Tutor.findById(id)
        return tutor
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
            // return  await Category.find();
            const skip = (page - 1) * limit;
            const categories = await Category.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();
                const totalRecord = await Category.countDocuments()
                return {categories,totalRecord}    
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
}

export default AdminTutorRepository