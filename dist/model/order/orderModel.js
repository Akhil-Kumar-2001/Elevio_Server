"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseIds: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        }], // Array of course IDs
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true, // Still unique per order
    },
    // razorpayPaymentId: {
    //     type: String,
    // },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "success", "failed"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
    },
}, { timestamps: true });
// Optional: Index to improve query performance (no unique constraint here)
orderSchema.index({ userId: 1, razorpayOrderId: 1 });
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.Order = Order;
