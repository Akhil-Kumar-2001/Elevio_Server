import mongoose, { Document, Schema } from "mongoose";

// Interface for Message document
interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  imageUrl?:string;
  isDeleted?:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Message schema definition
const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      // required: true,
    },
    imageUrl:{
      type:String,
      trim:true
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

// Model creation
const Message = mongoose.model<IMessage>("Message", messageSchema);

export {Message,IMessage};
