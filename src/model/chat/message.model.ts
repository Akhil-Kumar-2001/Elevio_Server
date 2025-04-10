// import mongoose, { Schema,model,Document,ObjectId } from "mongoose";


// interface IMessage extends Document{
//     chatId:ObjectId;
//     senderId:ObjectId;
//     senderRole:"Student"|"Tutor";
//     message?:string;
//     imageUrl?:string;
//     timestamp:Date;
//     isRead:boolean;

// }

// const messageSchema = new Schema<IMessage>(
//     {
//       chatId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: "Chat",
//       },
//       senderId: {
//         type: Schema.Types.ObjectId,
//         required: true,
//         refPath: "senderRole",
//       },
//       senderRole: {
//         type: String,
//         enum: ["Student", "Tutor"],
//         required: true,
//       },
     
//       message: {
//         type: String,
//         trim:true,
//       },
//       imageUrl:{
//         type:String,
//         trim:true
//       },
      
//       timestamp: {
//         type: Date,
//         default: Date.now,
//       },

//       isRead:{
//         type:Boolean,
//         default:false,
//       }
//     },
//     { timestamps: true }
//   );
  
//   const Message =mongoose.model<IMessage>("Message", messageSchema);
  
//   export { Message, IMessage };
  

import mongoose, { Document, Schema } from "mongoose";

// Interface for Message document
interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  imageUrl?:string;
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
  },
  {
    timestamps: true,
  }
);

// Model creation
const Message = mongoose.model<IMessage>("Message", messageSchema);

export {Message,IMessage};
