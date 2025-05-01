// model/wishlist/wishlistModel.ts
import { Schema, Document, model, Types } from "mongoose";

interface IWishlistItem {
    courseId: Types.ObjectId;
}

interface IWishlist extends Document {
    userId: Types.ObjectId;
    items: IWishlistItem[];
    createdAt: Date;
    updatedAt: Date;
    _id: Types.ObjectId;
    __v: number;
}

const wishlistItemSchema = new Schema<IWishlistItem>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    }
}, { _id: false });

const wishlistSchema = new Schema<IWishlist>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        unique: true
    },
    items: {
        type: [wishlistItemSchema],
        default: []
    }
}, { timestamps: true });

const Wishlist = model<IWishlist>("Wishlist", wishlistSchema);

export { Wishlist, IWishlist, IWishlistItem };
