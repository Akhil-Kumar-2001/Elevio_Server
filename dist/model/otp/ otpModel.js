"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        index: true, // Improves lookup performance
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300, // TTL: Deletes document after 5 minutes
    },
}, { timestamps: true });
const OTP = (0, mongoose_1.model)("OTP", otpSchema);
exports.OTP = OTP;
