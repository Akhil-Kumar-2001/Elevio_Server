import { Tutor, TutorType } from '../../../model/tutor/tutorModel';
import ITutorProfileRepository from '../ITutorProfileRepository'
import { OTP,OTPType } from '../../../model/otp/ otpModel';
import { TutorVerificationFormData } from '../../../Types/basicTypes';

class TutorProfileRepository implements ITutorProfileRepository{

    
    async getTutorById(id: string): Promise<TutorType | null> {
        const tutor = await Tutor.findById(id)
        return tutor
    }

    async verifyTutor(formData: TutorVerificationFormData): Promise<TutorType | null> {
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

    async updateProfile(id: string, formData: TutorType): Promise<boolean | null> {
        const updatedTutor = await Tutor.findByIdAndUpdate(
            id, 
            { $set: formData }, 
            { new: true } 
        );
        return updatedTutor ? true : false;
    }

}
    

export default TutorProfileRepository;