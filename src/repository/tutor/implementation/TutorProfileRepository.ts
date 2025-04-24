import { Tutor, ITutor } from '../../../model/tutor/tutorModel';
import ITutorProfileRepository from '../ITutorProfileRepository'
import { SessionInfo, TutorVerificationFormData } from '../../../Types/basicTypes';
import { Category, ICategory } from '../../../model/category/categoryModel';
import { ISession, Session } from '../../../model/sessiion/sessionModel';
import { Student } from '../../../model/student/studentModel';

class TutorProfileRepository implements ITutorProfileRepository {


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

    async sessionExist(sessionData: ISession): Promise<boolean | null> {
        try {
            const start = new Date(sessionData.startTime);
            const end = new Date(start.getTime() + sessionData.duration * 60000); // end time in ms

            const existingSession = await Session.findOne({
                tutorId: sessionData.tutorId,
                status: 'scheduled',
                startTime: {
                    $lt: end, // existing session starts before the new one ends
                },
                $expr: {
                    $gt: [
                        { $add: ["$startTime", { $multiply: ["$duration", 60000] }] }, // existing endTime
                        start, // existing session ends after the new one starts
                    ]
                }
            });

            return existingSession ? true : false;
        } catch (error) {
            console.error("Error checking session existence:", error);
            return null;
        }
    }

    async createSession(sessionData: ISession): Promise<boolean | null> {
        try {
            const session = new Session(sessionData);
            await session.save();
            return true;
        } catch (error) {
            console.error("Error creating session:", error);
            return null;
        }
    }

    async getSessions(tutorId: string): Promise<SessionInfo[] | null> {
        try {
            // First get the session documents
            const sessions = await Session.find({
                tutorId,
                status: 'scheduled',
            });

            // For each session, get the student information
            const result = await Promise.all(sessions.map(async (session) => {
                const student = await Student.findById(session.studentId);

                return {
                    studentName: student?.username || 'Unknown',
                    startTime: session.startTime,
                    duration: session.duration,
                    status: session.status
                };
            }));

            // Sort the results by startTime in ascending order
            const sortedResult = result.sort((a, b) => {
                return a.startTime.getTime() - b.startTime.getTime();
            });

            return sortedResult;
        } catch (error) {
            console.error("Error getting sessions:", error);
            return null;
        }
    }
}


export default TutorProfileRepository;