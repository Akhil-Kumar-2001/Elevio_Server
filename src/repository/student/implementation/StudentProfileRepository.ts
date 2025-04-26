import { Types } from "mongoose";
import { ISession, Session } from "../../../model/sessiion/sessionModel";
import { IStudent, Student } from "../../../model/student/studentModel";
import { ISubscriptionPurchased, SubscriptionPurchased } from "../../../model/subscription/SubscriptionPurchased";
import { Tutor } from "../../../model/tutor/tutorModel";
import { EditStudentType, SessionInfo } from "../../../Types/basicTypes";
import IStudentProfileRepository from "../IStudentProfileRepository";

class StudentProfileRepository implements IStudentProfileRepository {
  async getStudent(id: string): Promise<IStudent | null> {
    const student = await Student.findOne({ _id: id });
    return student;
  }

  async getSubscriptionDetails(id: string): Promise<ISubscriptionPurchased | null> {
    try {
      const subscription = await SubscriptionPurchased.findOne({
        userId: id,
        status: 'active',
        paymentStatus: 'paid'
      })
        .populate('planId')
        .sort({ createdAt: -1 });

      return subscription
    } catch (error) {
      return null
    }
  }

  async editProfile(id: string, formData: EditStudentType): Promise<IStudent | null> {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: formData },
      { new: true }
    );
    return updatedStudent ? updatedStudent : null;
  }

  async getSessions(studentId: string): Promise<SessionInfo[] | null> {
    try {
      // Get current time
      const currentTime = new Date();
      // First get the session documents
      const sessions = await Session.find({
        studentId,
        status: { $in: ['scheduled', 'active'] },
        // Ensure the session's end time (startTime + duration) is less than current time
        $expr: {
          $gte: [
            { $add: ["$startTime", { $multiply: ["$duration", 60000] }] }, // duration in milliseconds
            currentTime
          ]
        }
      });


      // For each session, get the student information
      const result = await Promise.all(sessions.map(async (session) => {
        const tutor = await Tutor.findById(session.tutorId);

        return {
          _id: session._id,
          tutorName: tutor?.username || 'Unknown',
          startTime: session.startTime,
          duration: session.duration,
          status: session.status,
          roomId: session.roomId,
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


  async getSessionDetails(_id: string): Promise<ISession | null> {
    const session = await Session.findOne({ _id });
    return session;
  }


  async updateSessionStatus(_id: string, status: string): Promise<boolean | null> {
    console.log("iam here on update session repo", status)
    const session = await Session.findOneAndUpdate(
      { _id: new Types.ObjectId(_id) },
      { $set: { status } },
      { new: true }
    );
    console.log("iam here on update session repo session", session)
    return session ? true : null
  }
}

export default StudentProfileRepository