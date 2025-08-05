"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCourseSearchDto = exports.mapCourseCategorysToDto = exports.mapCourseCategoryToDto = exports.mapCoursesResponsesToDto = exports.mapCourseResponseToDto = exports.mapCoursesTutorToDto = exports.mapCourseTutorToDto = exports.mapCoursesToDto = exports.mapCourseToDto = void 0;
const cloudinaryUtility_1 = require("../../utils/cloudinaryUtility");
const mapCourseToDto = (course) => {
    var _a;
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
        purchasedStudents: ((_a = course.purchasedStudents) === null || _a === void 0 ? void 0 : _a.map(id => id.toString())) || [],
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
exports.mapCourseToDto = mapCourseToDto;
const mapCoursesToDto = (courses) => {
    return courses.map(exports.mapCourseToDto);
};
exports.mapCoursesToDto = mapCoursesToDto;
const mapCourseTutorToDto = (course) => {
    var _a;
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
        purchasedStudents: ((_a = course.purchasedStudents) === null || _a === void 0 ? void 0 : _a.map(id => id.toString())) || [],
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
exports.mapCourseTutorToDto = mapCourseTutorToDto;
const mapCoursesTutorToDto = (courses) => {
    return courses.map(exports.mapCourseTutorToDto);
};
exports.mapCoursesTutorToDto = mapCoursesTutorToDto;
const mapCourseResponseToDto = (course) => {
    var _a;
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
        purchasedStudents: ((_a = course.purchasedStudents) === null || _a === void 0 ? void 0 : _a.map(id => id.toString())) || [],
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
exports.mapCourseResponseToDto = mapCourseResponseToDto;
const mapCoursesResponsesToDto = (courses) => {
    return courses.map(exports.mapCourseResponseToDto);
};
exports.mapCoursesResponsesToDto = mapCoursesResponsesToDto;
const mapCourseCategoryToDto = (course) => {
    var _a;
    return {
        _id: course._id,
        tutorId: course.tutorId.toString(),
        title: course.title,
        price: course.price,
        subtitle: course.subtitle,
        description: course.description,
        category: {
            _id: course.category._id,
            name: course.category.name,
        },
        totalDuration: course.totalDuration,
        totalLectures: course.totalLectures,
        totalSections: course.totalSections,
        purchasedStudents: ((_a = course.purchasedStudents) === null || _a === void 0 ? void 0 : _a.map(id => id.toString())) || [],
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
exports.mapCourseCategoryToDto = mapCourseCategoryToDto;
const mapCourseCategorysToDto = (courses) => {
    return courses.map(exports.mapCourseCategoryToDto);
};
exports.mapCourseCategorysToDto = mapCourseCategorysToDto;
const mapToCourseSearchDto = (course) => {
    return {
        id: course._id,
        title: course.title || '',
        price: course.price || 0,
        imageThumbnail: course.imageThumbnail ? (0, cloudinaryUtility_1.getSignedImageUrl)(course.imageThumbnail) : '', // Apply signed URL
        category: course.category ? course.category.name || '' : '', // Flatten category to string
        createdAt: course.createdAt || new Date(),
        purchasedStudents: course.purchasedStudents ? course.purchasedStudents.map(id => id.toString()) : [],
    };
};
exports.mapToCourseSearchDto = mapToCourseSearchDto;
