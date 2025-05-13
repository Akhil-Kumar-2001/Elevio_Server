"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Section = void 0;
const mongoose_1 = require("mongoose");
const sectionSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    totalLectures: {
        type: Number,
        default: 0,
    },
    totalDuration: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Section = (0, mongoose_1.model)("Section", sectionSchema);
exports.Section = Section;
