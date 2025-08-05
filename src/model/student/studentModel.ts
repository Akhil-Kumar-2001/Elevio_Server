import { Schema, Document, model, ObjectId } from "mongoose";

interface IStudent extends Document {
    _id:string;
    username?: string;
    email?: string;
    password?: string;
    status?: number;
    role: string;
    googleID?: String
    enrolledCourseCount?: number;
    profilePicture?: string;
    createdAt?: string;
    updatedAt?: string;
}

const studentSchema = new Schema<IStudent>({
    username: {
        type: String,
        required: true,
        message: 'User name required',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        message: "Email id required",
    },
    password: {
        type: String,
        required: true,
        message: "Password is required",
    },
    status: {
        type: Number,
        enum: [0, 1, -1],
        default: 0,
    },
    role: {
        type: String,
        enum: ["Student"],
        default: "Student",
    },
    googleID: {
        type: String
    },
    enrolledCourseCount: {
        type: Number,
        default: 0,
    },
    profilePicture: {
        type: String,
    },
}, { timestamps: true });

const Student = model<IStudent>("Student", studentSchema);
export { Student, IStudent };
