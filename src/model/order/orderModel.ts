import { Schema, Document, model, Types } from "mongoose";

interface IOrder extends Document {
    userId: Schema.Types.ObjectId;
    courseIds: Schema.Types.ObjectId[]; // Changed to array for multiple courses
    razorpayOrderId: string;
    // razorpayPaymentId?: string;
    amount: number;
    status: "pending" | "success" | "failed";
    paymentMethod?: string;
    createdAt: Date;
    updatedAt: Date;
    _id: Types.ObjectId;
    __v: number;
}

const orderSchema = new Schema<IOrder>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseIds: [{
        type: Schema.Types.ObjectId,
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

const Order = model<IOrder>("Order", orderSchema);
export { Order, IOrder };