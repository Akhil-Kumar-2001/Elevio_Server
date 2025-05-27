"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    tutorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Tutor",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    totalDuration: {
        type: Number,
        default: 0,
    },
    totalLectures: {
        type: Number,
        default: 0,
    },
    totalSections: {
        type: Number,
        default: 0,
    },
    purchasedStudents: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Student" }],
        default: [],
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "draft", "listed"],
        default: "draft",
    },
    rejectedReason: {
        type: String,
        default: "",
    },
    imageThumbnail: {
        type: String,
        required: true,
    },
    avgRating: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const Course = (0, mongoose_1.model)("Course", courseSchema);
exports.Course = Course;
