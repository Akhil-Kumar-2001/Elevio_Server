import { TutorType, Tutor } from '../../../model/tutor/tutorModel';
import IAdminTutorRepository from '../IAdminTutorRepository'

class AdminTutorRepository implements IAdminTutorRepository {
    async getPendingTutors(): Promise<TutorType[] | null> {
        return await Tutor.find({ isVerified: "pending" });
    }

    async getTutorById(id: string): Promise<TutorType | null> {
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

}

export default AdminTutorRepository