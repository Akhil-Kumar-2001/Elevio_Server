"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
// model/wishlist/wishlistModel.ts
const mongoose_1 = require("mongoose");
const wishlistItemSchema = new mongoose_1.Schema({
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }
}, { _id: false });
const wishlistSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        unique: true
    },
    items: {
        type: [wishlistItemSchema],
        default: []
    }
}, { timestamps: true });
const Wishlist = (0, mongoose_1.model)("Wishlist", wishlistSchema);
exports.Wishlist = Wishlist;
