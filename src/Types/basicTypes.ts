import { Types } from "mongoose";

export interface TutorVerificationFormData {
  _id: string;
  isVerified: "pending" | "approved" | "rejected";
  profile: {
    bio: string;
    documents: {
      fileUrl: string;
      type: "id_verification" | "experience_certificate" | string;
    }[];
    experience: string;
    qualification: string;
    skills: string[];
  };
}


export interface CourseData {
  courseName: string;
  coursePrice: string;
  category: string;
  thumbnail: string;
  description: string;
}

export interface ISectionData {
  title: string,
  description: string,
}
export interface ILectureData {
  title: string,
  courseId: string,
  sectionId:string
}

export interface EditStudentType {
  username:string;
  profilePicture:string | null;
}

// Interface for cart item with course details
export interface ICartItemWithDetails {
  courseId: string; // Changed from Types.ObjectId to string
  price: number;
  courseTitle: string;
  courseSubtitle: string;
  courseDuration: number;
  courseLectures: number;
  courseImage: string;
}

// Interface for the enriched cart
export interface ICartWithDetails {
  userId: string; // Changed from Types.ObjectId to string
  items: ICartItemWithDetails[];
  totalPrice: number;
  status: "active" | "converted" | "abandoned";
  createdAt: Date;
  updatedAt: Date;
  _id: string; // Changed from Types.ObjectId to string
  __v: number;
}


export interface IOrderCreateData {
  userId: Types.ObjectId;
  courseIds: Types.ObjectId[];
  razorpayOrderId: string;
  amount: number;
  status: "pending" | "success" | "failed";
  paymentMethod?: string; 
}
