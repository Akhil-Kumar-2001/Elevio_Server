export interface ICourseDto {
  _id?: string;
  tutorId?: string;
  title?: string;
  price?: number;
  subtitle?: string;
  description?: string;
  category?: string;
  totalDuration?: number;
  totalLectures?: number;
  totalSections?: number;
  purchasedStudents?: string[];
  isBlocked?: boolean;
  status?: "pending" | "accepted" | "rejected" | "draft" | "listed";
  rejectedReason?: string;
  imageThumbnail: string;
  avgRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICourseTutorDto {
  _id?: string;
  tutorId?: string;
  title?: string;
  price?: number;
  subtitle?: string;
  description?: string;
  category?: string;
  totalDuration?: number;
  totalLectures?: number;
  totalSections?: number;
  purchasedStudents?: string[];
  isBlocked?: boolean;
  status?: "pending" | "accepted" | "rejected" | "draft" | "listed";
  rejectedReason?: string;
  // imageThumbnail: string;
    imageThumbnailId: string;

  avgRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}


export interface ICourseResponseDto {
  _id?: string;
  tutorId?: {
    _id:string,
    username:string,
  }
  title?: string;
  price?: number;
  subtitle?: string;
  description?: string;
  category?: string;
  totalDuration?: number;
  totalLectures?: number;
  totalSections?: number;
  purchasedStudents?: string[];
  isBlocked?: boolean;
  status?: "pending" | "accepted" | "rejected" | "draft" | "listed";
  rejectedReason?: string;
  // imageThumbnail: string;
    imageThumbnailId: string;

  avgRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}



export interface ICourseCategoryDto {
  _id?: string;
  tutorId?: string;
  title?: string;
  price?: number;
  subtitle?: string;
  description?: string;
  category?: {
    _id:string,
    name:string
  }
  totalDuration?: number;
  totalLectures?: number;
  totalSections?: number;
  purchasedStudents?: string[];
  isBlocked?: boolean;
  status?: "pending" | "accepted" | "rejected" | "draft" | "listed";
  rejectedReason?: string;
  imageThumbnail: string;
  // imageThumbnailId: string;
  avgRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}



export interface ICourseSearchDto {
  id: string;
  title: string;
  price: number;
  imageThumbnail: string;
  category: {
    _id:string,
    name:string,
  };
  createdAt: Date;
  purchasedStudents: string[];
}

export interface ICourseSearchServiceDto {
  id: string;
  title: string;
  price: number;
  imageThumbnail: string;
  category: string;
  createdAt: Date;
  purchasedStudents: string[];
}



