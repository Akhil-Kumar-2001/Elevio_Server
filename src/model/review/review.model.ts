import { Schema, Document, model, Types } from "mongoose";

interface IReview extends Document {
    courseId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    review: string;
    reply:string;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
    _id: Types.ObjectId;
    __v: number;
}


export interface IUser {
  _id: string,
  username: string,
}

export interface IReviewExtended extends Omit<IReview,'userId'>{
    userId: IUser
}

const reviewSchema = new Schema<IReview>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    // username:{
    //     type:String
    // }
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // 5-star rating system
    },
    review: {
        type: String,
        required: true,
    },
    reply: {
        type: String,
        default: null,
    },
    isVisible: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// Compound index to ensure a user can review a course only once
reviewSchema.index({ courseId: 1, userId: 1 }, { unique: true });

const Review = model<IReview>("Review", reviewSchema);

export { Review, IReview };