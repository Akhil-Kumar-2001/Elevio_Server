import { Tutor, ITutor } from '../../../model/tutor/tutorModel';
import ITutorProfileRepository from '../ITutorProfileRepository'
import { TutorVerificationFormData } from '../../../Types/basicTypes';
import { Category, ICategory } from '../../../model/category/categoryModel';

class TutorProfileRepository implements ITutorProfileRepository{

    
    async getTutorById(id: string): Promise<ITutor | null> {
        const tutor = await Tutor.findById(id)
        return tutor
    }

    async verifyTutor(formData: TutorVerificationFormData): Promise<ITutor | null> {
        const updatedTutor = await Tutor.findByIdAndUpdate(
            formData._id,
            {
                $set: {
                    isVerified: formData.isVerified,
                    "profile.bio": formData.profile.bio,
                    "profile.experience": formData.profile.experience,
                    "profile.qualification": formData.profile.qualification,
                    "profile.skills": formData.profile.skills,
                    "profile.documents": formData.profile.documents,
                },
            },
            { new: true } // Return the updated document
        );
    
        return updatedTutor;
    }

    async updateProfile(id: string, formData: ITutor): Promise<boolean | null> {
        const updatedTutor = await Tutor.findByIdAndUpdate(
            id, 
            { $set: formData }, 
            { new: true } 
        );
        return updatedTutor ? true : false;
    }   
}
    

export default TutorProfileRepository;