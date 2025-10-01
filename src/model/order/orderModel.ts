import { Schema, Document, model, Types } from "mongoose";

interface IOrder extends Document {
    userId: Schema.Types.ObjectId;
    courseIds: Schema.Types.ObjectId[]; 
    razorpayOrderId: string;
    amount: number;
    status: "pending" | "success" | "failed";
    paymentMethod?: string;
    expireAt?: Date | null;
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

orderSchema.index(
  { userId: 1, "courseIds": 1 },
  { unique: true, partialFilterExpression: { status: "pending" } }
);

const Order = model<IOrder>("Order", orderSchema);
export { Order, IOrder };