"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tutor = void 0;
const mongoose_1 = require("mongoose");
const tutorSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        message: "Name is required",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        message: "Email is required",
    },
    password: {
        type: String,
        required: true,
        message: "Password is required",
    },
    role: {
        type: String,
        enum: ["Tutor"],
        default: "Tutor",
    },
    status: {
        type: Number,
        enum: [0, 1, -1],
        default: 0,
    },
    isVerified: {
        type: String,
        enum: ["not_verified", "pending", "verified"],
        default: "not_verified",
    },
    profile: {
        bio: { type: String },
        profilePicture: { type: String },
        qualification: { type: String },
        experience: { type: String },
        skills: { type: [String], default: [] },
        documents: [
            {
                type: { type: String, required: true },
                fileUrl: { type: String, required: true },
            },
        ],
    },
}, { timestamps: true });
const Tutor = (0, mongoose_1.model)("Tutor", tutorSchema);
exports.Tutor = Tutor;
