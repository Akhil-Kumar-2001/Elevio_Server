import { ICourseDto } from "../../dtos/course/courseDto";
import { ICourse } from "../../model/course/courseModel";


export const mapCourseToDto = (course: ICourse): ICourseDto => {
  return {
    _id: course._id,
    tutorId: course.tutorId.toString(),
    title: course.title,
    price: course.price,
    subtitle: course.subtitle,
    description: course.description,
    category: course.category.toString(),
    totalDuration: course.totalDuration,
    totalLectures: course.totalLectures,
    totalSections: course.totalSections,
    purchasedStudents: course.purchasedStudents?.map(id => id.toString()) || [],
    isBlocked: course.isBlocked,
    status: course.status,
    rejectedReason: course.rejectedReason,
    imageThumbnail: course.imageThumbnail,
    avgRating: course.avgRating,
    totalReviews: course.totalReviews,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  };
};

export const mapCoursesToDto = (courses: ICourse[]): ICourseDto[] => {
  return courses.map(mapCourseToDto);
};
