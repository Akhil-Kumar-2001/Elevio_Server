import { Schema, Document, model } from "mongoose";

interface ICategory extends Document {
    name: string;
    status?: number;
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
        message: "Category name is required",
    },
    status: {
        type: Number,
        enum: [ 1, -1],
        default: 1,
    },
}, { timestamps: true });

const Category = model<ICategory>("Category", categorySchema);
export { Category, ICategory };
