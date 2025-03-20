import { Schema, Document, model } from "mongoose";

interface ISection extends Document {
    courseId: Schema.Types.ObjectId;
    title: string;
    description: string;
    order: number;
    totalLectures?: number;
    totalDuration?: number;
    isPublished?: boolean;
}

const sectionSchema = new Schema<ISection>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    totalLectures: {
        type: Number,
        default: 0,
    },
    totalDuration: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Section = model<ISection>("Section", sectionSchema);
export { Section, ISection };
