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
