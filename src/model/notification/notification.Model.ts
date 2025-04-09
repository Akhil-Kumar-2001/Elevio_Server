import mongoose, { Document, Schema } from "mongoose";

// Interface for Notification document
interface INotification extends Document {
  receiverId: mongoose.Types.ObjectId;
  content: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Notification schema definition
const notificationSchema = new Schema<INotification>(
  {
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User", // or "Tutor" depending on your model structure
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

// Create indexes for better query performance
notificationSchema.index({ receiverId: 1, createdAt: -1 });
notificationSchema.index({ receiverId: 1, isRead: 1 });

// Model creation
const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export { Notification, INotification };