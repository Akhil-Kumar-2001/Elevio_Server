"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        message: 'User name required',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        message: "Email id required",
    },
    password: {
        type: String,
        required: true,
        message: "Password is required",
    },
    status: {
        type: Number,
        enum: [0, 1, -1],
        default: 0,
    },
    role: {
        type: String,
        enum: ["Student"],
        default: "Student",
    },
    googleID: {
        type: String
    },
    enrolledCourseCount: {
        type: Number,
        default: 0,
    },
    profilePicture: {
        type: String,
    },
}, { timestamps: true });
const Student = (0, mongoose_1.model)("Student", studentSchema);
exports.Student = Student;
