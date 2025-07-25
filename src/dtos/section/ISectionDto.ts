export interface ISectionDto {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  totalLectures: number;
  totalDuration: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}
