import mongoose, { Document, Schema, Types } from "mongoose";

// Interface for Chat document
interface IChat extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
  lastMessage: string;
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
    lastMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


const Chat = mongoose.model<IChat>("Chat", chatSchema);


export { Chat, IChat };
