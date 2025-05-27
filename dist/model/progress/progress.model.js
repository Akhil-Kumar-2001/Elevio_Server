"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const mongoose_1 = require("mongoose");
const progressSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    completedLectures: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Lecture",
            default: [],
        }],
    lastAccessedLecture: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Lecture",
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    lastAccessDate: {
        type: Date,
    },
    completionDate: {
        type: Date,
    }
}, { timestamps: true });
// Create a compound index for faster lookups
progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
const Progress = (0, mongoose_1.model)("Progress", progressSchema);
exports.Progress = Progress;
