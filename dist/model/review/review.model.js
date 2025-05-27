"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const Review = (0, mongoose_1.model)("Review", reviewSchema);
exports.Review = Review;
