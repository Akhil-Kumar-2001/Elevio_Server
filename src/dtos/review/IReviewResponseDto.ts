
export interface IReviewResponseDto {
    _id: string;
    courseId: string;
    userId: string;
    rating: number;
    review: string;
    reply: string | null;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReviewDto {
    _id: string;
    courseId: string;
    userId: {
        _id: string,
        username: string;
    }
    rating: number;
    review: string;
    reply: string | null;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}
