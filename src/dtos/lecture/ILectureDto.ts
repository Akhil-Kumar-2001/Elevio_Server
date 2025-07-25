
export interface ILectureDto {
  _id: string;
  sectionId: string;
  courseId: string;
  title: string;
  videoUrl?: string;
  duration: number;
  order: number;
  status: "processing" | "processed";
  isPreview: boolean;
  createdAt?: string;
  updatedAt?: string;
}
