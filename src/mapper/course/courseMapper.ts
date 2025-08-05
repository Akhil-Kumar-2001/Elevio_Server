import { ICourseCategoryDto, ICourseDto, ICourseResponseDto, ICourseSearchDto, ICourseSearchServiceDto, ICourseTutorDto } from "../../dtos/course/courseDto";
import { ICourse, ICourseCategoryExtended, ICourseExtended } from "../../model/course/courseModel";
import { getSignedImageUrl } from "../../utils/cloudinaryUtility";


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
export const mapCourseTutorToDto = (course: ICourse): ICourseTutorDto => {
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
    imageThumbnailId: course.imageThumbnailId,
    avgRating: course.avgRating,
    totalReviews: course.totalReviews,
    createdAt: course.createdAt.toISOString(),
    updatedAt: course.updatedAt.toISOString(),
  };
};

export const mapCoursesTutorToDto = (courses: ICourse[]): ICourseTutorDto[] => {
  return courses.map(mapCourseTutorToDto);
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
    imageThumbnailId: course.imageThumbnailId,
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







export const mapToCourseSearchDto = (course: ICourseCategoryExtended): ICourseSearchServiceDto => {
  return {
    id: course._id,
    title: course.title || '',
    price: course.price || 0,
    imageThumbnail: course.imageThumbnail ? getSignedImageUrl(course.imageThumbnail) : '', // Apply signed URL
    category: course.category ? course.category.name || '' : '', // Flatten category to string
    createdAt: course.createdAt || new Date(),
    purchasedStudents: course.purchasedStudents ? course.purchasedStudents.map(id => id.toString()) : [],
  };
};
