// model/subscription/subscriptionPurchasedModel.ts
import { Schema, Document, model, Types } from "mongoose";
import { ISubscription } from "./subscriptionModel";

interface ISubscriptionPurchased extends Document {
    userId: Types.ObjectId;
    planId: Types.ObjectId | ISubscription;
    orderId: string; // Razorpay Order ID
    startDate: Date | null; // Nullable, set after payment
    endDate: Date | null;
    status: "pending" | "active" | "expired" | "canceled"; // Enum for clarity
    paymentStatus: "pending" | "paid" | "failed";
    paymentDetails?: {
        paymentId: string;
        paymentMethod: string;
        paymentAmount: number;
    };
    createdAt: Date;
    updatedAt: Date;
    _id: Types.ObjectId; // Explicitly define _id
    __v: number; // Version key
}

const subscriptionPurchasedSchema = new Schema<ISubscriptionPurchased>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    planId: {
        type: Schema.Types.ObjectId,
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

const SubscriptionPurchased = model<ISubscriptionPurchased>("SubscriptionPurchased", subscriptionPurchasedSchema);

export { SubscriptionPurchased, ISubscriptionPurchased };