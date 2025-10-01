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
  title: string;
  price: string;
  category: string;
  imageThumbnail: string;
  description: string;
}

export interface ISectionData {
  title: string,
  description: string,
}
export interface ILectureData {
  title: string,
  courseId: string,
  sectionId: string
}

export interface EditStudentType {
  username: string;
  profilePicture: string | null;
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
  endDate: null;
  status: "pending" | "active" | "expired" | "canceled";
  paymentStatus: "pending" | "paid" | "failed";
  paymentDetails?: {
    paymentId?: string;
    paymentMethod: String,
    paymentAmount: Number,
  },
  expireAt?: Date;

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
  lastMessage?: string;
  unreadCount?: number;
  updatedAt?: string;
};

export interface review {
  courseId: string;
  userId: string;
  rating: number;
  review: string;
}

export interface PaymentDetails {
  paymentId?: string;
  paymentMethod?: string;
  paymentAmount?: number;
}

export interface PaymentData {
  paymentStatus: 'paid' | 'unpaid' | 'pending' | 'failed';
  status: 'active' | 'inactive' | 'expired' | 'suspended' | 'canceled';
  startDate?: Date;
  endDate?: Date;
  paymentDetails?: PaymentDetails;
}


export interface DashboardData {
  totalStudents: number;
  totalTutors: number;
  totalCourses: number;
  tutorTotalIncome: number;
  adminTotalIncome: number;
  adminBalance: number;
}


export interface CategoryIncome {
  _id?: string
  name: string;
  value: number;
}


export interface MonthlyIncome {
  month: string;
  income: number;
}

export interface YearlyIncome {
  year: string;
  income: number;
}



export interface StudentsCount {
  name: string;
  students: number;
}

export interface IDashboardDetails {
  courseCount: number;
  totalStudents: number;
  totalIncome: number;
  totalTransactions: number;
  lastTransactionDate: Date | null;
}

export interface SessionInfo {
  studentName?: string;
  tutorName?: string;
  startTime: Date;
  duration: number;
  status: string;
}

export interface EditReview {
  rating: number;
  review: string;
}

export interface IBasicStudentInfo {
  profilePicture?: string;
  username?: string;
  email?: string;
  role: string;
}


export interface IServiceResponse<T> {
  success: boolean;         
  message: string;          
  data?: T;               
  statusCode?: number;      
}


export interface ICourseData {
  tutorId: string;
  title: string;
  subtitle: string;
  price: string; // change to `number` if appropriate
  category: string;
  description: string;
}


// types/CourseCreateData.ts
export interface ICourseCreateData {
  title: string;
  subtitle: string;
  price: string;        // as string from form/body
  category: string;     // category ObjectId as string
  description: string;
}


export interface ICourseFullData {
  title: string;
  subtitle: string;
  price: number;      // converted to number for DB
  category: string;
  description: string;
  tutorId: string;
  imageThumbnail: string;
  imageThumbnailId: string;
}


export interface ICourseEditableFields {
  title?: string;
  subtitle?: string;
  price?: string; 
  category?: string;
  description?: string;
  status?: string;
}

export interface ICourseFullEditableFields {
  title?: string;
  subtitle?: string;
  price?: number | string; 
  category?: string;
  description?: string;
  status?: string;
  imageThumbnail?:string;
  imageThumbnailId?:string;
  
}

