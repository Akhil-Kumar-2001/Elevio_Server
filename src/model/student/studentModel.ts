import { Schema, Document, model, ObjectId } from "mongoose";

interface IStudent extends Document {
    username?: string;
    email?: string;
    password?: string;
    status?: number;
    role: string;  
    // subscription?: {
    //     subscriptionId: ObjectId;
    //     isActive: boolean;
    //     startDate: Date;
    //     endDate: Date;
    // };
    googleID?: String
    // freeCourseCount?: number;
    enrolledCourseCount?: number;
    profilePicture?: string;
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
    // subscription: {
    //     subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription" },
    //     isActive: { type: Boolean, default: false },
    //     startDate: { type: Date },
    //     endDate: { type: Date },
    // },
    googleID: {
        type: String
    },
    // freeCourseCount: {
    //     type: Number,
    //     default: 0, 
    // },
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
