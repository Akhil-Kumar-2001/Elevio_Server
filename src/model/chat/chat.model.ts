import mongoose, { Document, Schema, Types } from "mongoose";

// Interface for Chat document
interface IChat extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Chat schema
const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Model
const Chat = mongoose.model<IChat>("Chat", chatSchema);

// Exports
export { Chat, IChat };
