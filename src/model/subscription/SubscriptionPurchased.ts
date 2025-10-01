import { Schema, Document, model, Types } from "mongoose";
import { ISubscription } from "./subscriptionModel";

interface ISubscriptionPurchased extends Document {
    userId: Types.ObjectId;
    planId: Types.ObjectId;
    orderId: string;
    startDate: Date | null;
    endDate: Date | null;
    status: "pending" | "active" | "expired" | "canceled";
    paymentStatus: "pending" | "paid" | "failed";
    paymentDetails?: {
        paymentId: string;
        paymentMethod: string;
        paymentAmount: number;
    };
    createdAt: Date;
    updatedAt: Date;
    expireAt?: Date;
    _id: Types.ObjectId;
    __v: number;
}

export interface ISubscriptionPurchasedExtended extends Omit<ISubscriptionPurchased, 'planId'> {
    planId: ISubscription
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
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
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
    expireAt: {
        type: Date,
        index: { expireAfterSeconds: 0 },
        default: function () {
            return new Date(Date.now() + 5 * 60 * 1000);
        },
    }
}, { timestamps: true });

subscriptionPurchasedSchema.index(
    { userId: 1, planId: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: "pending" } }
);

const SubscriptionPurchased = model<ISubscriptionPurchased>("SubscriptionPurchased", subscriptionPurchasedSchema);

export { SubscriptionPurchased, ISubscriptionPurchased };
