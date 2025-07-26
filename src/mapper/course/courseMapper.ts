import { ICourseCategoryDto, ICourseDto, ICourseResponseDto } from "../../dtos/course/courseDto";
import { ICourse, ICourseCategoryExtended, ICourseExtended } from "../../model/course/courseModel";


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




export const mapCourseResponseToDto = (course: ICourseExtended): ICourseResponseDto => {
  return {
    _id: course._id,
    tutorId: {
      _id: course.tutorId._id,
      username: course.tutorId.username
    },
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

export const mapCoursesResponsesToDto = (courses: ICourseExtended[]): ICourseResponseDto[] => {
  return courses.map(mapCourseResponseToDto);
};



export const mapCourseCategoryToDto = (course: ICourseCategoryExtended): ICourseCategoryDto => {
  return {
    _id: course._id,
    tutorId:course.tutorId.toString(),
    title: course.title,
    price: course.price,
    subtitle: course.subtitle,
    description: course.description,
    category: {
      _id:course.category._id,
      name:course.category.name,
    },
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

export const mapCourseCategorysToDto = (courses: ICourseCategoryExtended[]): ICourseCategoryDto[] => {
  return courses.map(mapCourseCategoryToDto);
};
