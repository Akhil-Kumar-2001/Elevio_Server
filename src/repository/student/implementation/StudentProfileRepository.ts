import { IStudent, Student } from "../../../model/student/studentModel";
import { ISubscriptionPurchased, SubscriptionPurchased } from "../../../model/subscription/SubscriptionPurchased";
import { EditStudentType } from "../../../Types/basicTypes";
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
}

export default StudentProfileRepository