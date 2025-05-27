"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
// model/cart/cartModel.ts
const mongoose_1 = require("mongoose");
const cartItemSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });
const cartSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
cartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((total, item) => total + item.price, 0);
    next();
});
const Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.Cart = Cart;
