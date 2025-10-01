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
        }],
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
    },
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
    expireAt: {
        type: Date,
        index: { expireAfterSeconds: 0 },
        default: function () {
            return new Date(Date.now() + 5 * 60 * 1000);
        },
    },
}, { timestamps: true });
orderSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status !== "pending") {
        this.expireAt = null;
    }
    next();
});
orderSchema.index({ userId: 1, "courseIds": 1 }, { unique: true, partialFilterExpression: { status: "pending" } });
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.Order = Order;
