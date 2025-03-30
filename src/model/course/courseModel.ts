import { Schema, Document, model, Types } from "mongoose";

interface ICourse extends Document {
    tutorId: Types.ObjectId;
    title: string;
    price: number;
    subtitle: string;
    description: string;
    category: Types.ObjectId;
    totalDuration?: number;
    totalLectures?: number;
    totalSections?: number;
    purchasedStudents?: Types.ObjectId[];
    isBlocked?: boolean;
    status?: "pending" | "accepted" | "rejected" | "draft" | "listed";
    rejectedReason?: string;
    imageThumbnail: string;
    createdAt: Date;
    updatedAt: Date;
    _id: Types.ObjectId;
    __v: number;
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
    purchasedStudents: {
        type: [{ type: Schema.Types.ObjectId, ref: "User" }],
        default: [],
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