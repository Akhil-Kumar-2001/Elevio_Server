import { Schema, Document, model, Types } from "mongoose";

interface IProgress extends Document {
    studentId: Types.ObjectId;
    courseId: Types.ObjectId;
    completedLectures: Types.ObjectId[];
    lastAccessedLecture?: Types.ObjectId;
    progressPercentage: number;
    isCompleted: boolean;
    startDate: Date;
    lastAccessDate?: Date;
    completionDate?: Date;
}

const progressSchema = new Schema<IProgress>({
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    completedLectures: [{
        type: Schema.Types.ObjectId,
        ref: "Lecture",
        default: [],
    }],
    lastAccessedLecture: {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
    },
    progressPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    lastAccessDate: {
        type: Date,
    },
    completionDate: {
        type: Date,
    }
}, { timestamps: true });

// Create a compound index for faster lookups
progressSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Progress = model<IProgress>("Progress", progressSchema);
export { Progress, IProgress };