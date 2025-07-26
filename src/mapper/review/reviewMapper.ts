import { IReviewDto, IReviewResponseDto } from "../../dtos/review/IReviewResponseDto";
import { IReview, IReviewExtended } from "../../model/review/review.model";


    export function mapReviewToDto(review: IReview): IReviewResponseDto {
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

     export function mapReviewsToDtoList(reviews: IReview[]): IReviewResponseDto[] {
        return reviews.map(mapReviewToDto);
    }


    export function mapReviewReponseToDto(review: IReviewExtended): IReviewDto {
        return {
            _id: review._id.toString(),
            courseId: review.courseId.toString(),
            userId: {
                _id:review.userId._id,
                username:review.userId.username
            },
            rating: review.rating,
            review: review.review,
            reply: review.reply || null,
            isVisible: review.isVisible,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt
        };
    }

     export function mapReviewsReponseToDtoList(reviews: IReviewExtended[]): IReviewDto[] {
        return reviews.map(mapReviewReponseToDto);
    }

