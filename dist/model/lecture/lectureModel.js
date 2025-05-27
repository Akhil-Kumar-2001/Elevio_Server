"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lecture = void 0;
const mongoose_1 = require("mongoose");
const lectureSchema = new mongoose_1.Schema({
    sectionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: false, // Make it optional
        default: ""
    },
    duration: {
        type: Number,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["processing", "processed"],
        default: "processing",
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Lecture = (0, mongoose_1.model)("Lecture", lectureSchema);
exports.Lecture = Lecture;
