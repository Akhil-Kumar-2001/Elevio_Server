import { Schema, Document, model } from "mongoose";

interface ILecture extends Document {
    _id: string;
    sectionId: Schema.Types.ObjectId;
    courseId: Schema.Types.ObjectId;
    title: string;
    videoUrl?: string;
    videoKey?: string;
    duration: number;
    order: number;
    status: "processing" | "processed";
    isPreview?: boolean;
    createdAt?: string,
    updatedAt?: string
}

const lectureSchema = new Schema<ILecture>({
    sectionId: {
        type: Schema.Types.ObjectId,
        ref: "Section",
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: false, // Make it optional
        default: ""
    },
    videoKey: {
        type: String,
        default: null,
    },
    duration: {
        type: Number,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["processing", "processed"],
        default: "processing",
    },
    isPreview: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Lecture = model<ILecture>("Lecture", lectureSchema);
export { Lecture, ILecture };
