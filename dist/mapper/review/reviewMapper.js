"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapReviewToDto = mapReviewToDto;
exports.mapReviewsToDtoList = mapReviewsToDtoList;
exports.mapReviewReponseToDto = mapReviewReponseToDto;
exports.mapReviewsReponseToDtoList = mapReviewsReponseToDtoList;
function mapReviewToDto(review) {
    return {
        _id: review._id.toString(),
        courseId: review.courseId.toString(),
        userId: review.userId.toString(),
        rating: review.rating,
        review: review.review,
        reply: review.reply || null,
        isVisible: review.isVisible,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
    };
}
function mapReviewsToDtoList(reviews) {
    return reviews.map(mapReviewToDto);
}
function mapReviewReponseToDto(review) {
    return {
        _id: review._id.toString(),
        courseId: review.courseId.toString(),
        userId: {
            _id: review.userId._id,
            username: review.userId.username
        },
        rating: review.rating,
        review: review.review,
        reply: review.reply || null,
        isVisible: review.isVisible,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt
    };
}
function mapReviewsReponseToDtoList(reviews) {
    return reviews.map(mapReviewReponseToDto);
}
