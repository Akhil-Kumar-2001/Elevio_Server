// model/cart/cartModel.ts
import { Schema, Document, model, Types } from "mongoose";

interface ICartItem {
    courseId: Types.ObjectId;
    price: number;
}

interface ICart extends Document {
    userId: Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
    status: "active" | "converted" | "abandoned";
    createdAt: Date; // Add this
    updatedAt: Date; // Add this
    _id: Types.ObjectId; // Explicitly define _id
    __v: number; // Version key
}

const cartItemSchema = new Schema<ICartItem>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const cartSchema = new Schema<ICart>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    items: {
        type: [cartItemSchema],
        default: []
    },
    totalPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ["active", "converted", "abandoned"],
        default: "active"
    }
}, { timestamps: true });

cartSchema.pre('save', function(next) {
    this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
    next();
});

const Cart = model<ICart>("Cart", cartSchema);

export { Cart, ICart, ICartItem };