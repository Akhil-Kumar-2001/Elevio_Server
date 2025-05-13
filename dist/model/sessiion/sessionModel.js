"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const mongoose_1 = require("mongoose");
const sessionSchema = new mongoose_1.Schema({
    tutorId: {
        type: String,
        required: true,
    },
    studentId: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    roomId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'active', 'completed', 'cancelled'],
        default: 'scheduled',
    },
}, { timestamps: { createdAt: true, updatedAt: false } });
const Session = (0, mongoose_1.model)('Session', sessionSchema);
exports.Session = Session;
