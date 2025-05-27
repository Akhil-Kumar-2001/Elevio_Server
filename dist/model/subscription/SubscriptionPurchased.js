"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPurchased = void 0;
// model/subscription/subscriptionPurchasedModel.ts
const mongoose_1 = require("mongoose");
const subscriptionPurchasedSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    planId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subscription",
        required: true
    },
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "active", "expired", "canceled"],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    paymentDetails: {
        paymentId: { type: String },
        paymentMethod: { type: String },
        paymentAmount: { type: Number },
    },
}, { timestamps: true });
const SubscriptionPurchased = (0, mongoose_1.model)("SubscriptionPurchased", subscriptionPurchasedSchema);
exports.SubscriptionPurchased = SubscriptionPurchased;
