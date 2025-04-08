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

export interface IOrderCreateSubscriptionData {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  orderId: string;
  startDate: null;
  endDate:null;
  status: "pending" | "active" | "expired" | "canceled"; 
  paymentStatus: "pending" | "paid" | "failed";
  paymentDetails?: {
    paymentId?: string;
    paymentMethod: String ,
    paymentAmount: Number ,
},
}

export interface ISubscriptionPlan {
  id?: string;
  planName: string;
  duration: {
    value: number;
    unit: string;
  };
  price: number;
  features: string[];
  status: boolean;
}

export interface IPlan {
  planName: string;
  duration: {
    value: number;
    unit: "day" | "month" | "quarter" | "year";
  };
}

export interface ISubscription {
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  planId: IPlan | null;
}

export interface IStudentResponse {
  _id: string; 
  username?: string;
  email?: string;
  status?: number;
  role: string;
  subscription: ISubscription | null;
  enrolledCourseCount?: number;
  profilePicture?: string;
  createdAt?: Date; 
  updatedAt?: Date; 
  googleID?: string; 
}

export type UserMinimal = {
  _id: string;
  username: string;
  profilePicture?: string;
  role: "Student" | "Tutor";
};