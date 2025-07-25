import { ITutor } from '../../model/tutor/tutorModel';
import { ITutorDto } from '../../dtos/tutor/tutorDto';

export const mapTutorToDto = (tutor: ITutor): ITutorDto => {
  return {
    _id:tutor._id,
    username: tutor.username,
    email: tutor.email,
    role: tutor.role,
    status: tutor.status,
    isVerified: tutor.isVerified,
    profile: {
      bio: tutor.profile?.bio,
      profilePicture: tutor.profile?.profilePicture,
      qualification: tutor.profile?.qualification,
      experience: tutor.profile?.experience,
      skills: tutor.profile?.skills || [],
      documents: tutor.profile?.documents?.map(doc => ({
        type: doc.type,
        fileUrl: doc.fileUrl
      })) || []
    },
    createdAt:tutor.createdAt,
    updatedAt:tutor.updatedAt,
  };
};

export const mapTutorsToDto = (tutors: ITutor[]): ITutorDto[] => {
  return tutors.map(mapTutorToDto);
};
