import { Schema, Document, model } from "mongoose";

interface ISession extends Document {
  _id:string;
  tutorId: string;
  studentId: string;
  startTime: Date;
  duration: number; // in minutes
  roomId: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

const sessionSchema = new Schema<ISession>({
  tutorId: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled',
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

const Session = model<ISession>('Session', sessionSchema);
export { Session, ISession };
