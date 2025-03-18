import { Schema, Document, model } from "mongoose";

interface ICourse extends Document {
    tutorId: Schema.Types.ObjectId;
    title: string;
    price: number;
    subtitle: string;
    description: string;
    category: Schema.Types.ObjectId;
    totalDuration?: number;
    totalLectures?: number;
    totalSections?: number;
    isBlocked?: boolean;
    status?: "pending" | "accepted" | "rejected" | "draft" | "listed";
    rejectedReason?: string;
    imageThumbnail: string;
}

const courseSchema = new Schema<ICourse>({
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    totalDuration: {
        type: Number,
        default: 0,
    },
    totalLectures: {
        type: Number,
        default: 0,
    },
    totalSections: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "draft", "listed"],
        default: "draft",
    },
    rejectedReason: {
        type: String,
        default: "",
    },
    imageThumbnail: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Course = model<ICourse>("Course", courseSchema);
export { Course, ICourse };