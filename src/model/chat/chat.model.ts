// import mongoose,{Schema,model,Document, ObjectId } from "mongoose";
// import { Student } from "../student/studentModel";
// import { Tutor } from "../tutor/tutorModel";

// mongoose.model('User', Student.schema);
// mongoose.model('Tutor', Tutor.schema);

// interface IParticipant{
//     participantId:ObjectId;
//     role:"Student" | "Tutor";
//     username:string;
//     profilePhoto:string;
// }

// interface IChat extends Document{
//     participants:IParticipant[];
//     participantIds:string;
//     lastMessage?:{
//         message:string;
//         timestamp:Date;
//      };
//      isActive:boolean;
//      lastActivity:Date;
//      unreadCount?:{
//         participantId:ObjectId;
//         count:number;
//      }[];

//      createdAt:Date;

//      updatedAt:Date;
// }

// const participantSchema =new Schema<IParticipant>({
//     participantId:{
//         type:Schema.Types.ObjectId,
//         required:true,
        

//         ref: function (this: IParticipant): string {
//             return this.role === 'Student' ? 'Student' : 'Tutor';
//           }
//     },role:{
//         type:String,
//         enum:["Student","Tutor"],
//         required:true,
//     },
// });

// const chatSchema =new Schema<IChat>({
//     participants:{
//         type:[participantSchema],
//         required:true,
//     },
//     participantIds: {
//         type: String,
//         required: true,
//         unique: true,  
//       },
//     lastMessage:{
//         message:{type:String},
//         timestamp:{type:Date},
//     },
//     isActive:{
//         type:Boolean,
//         default:true
//     },
//     lastActivity:{
//         type:Date,
//         default:Date.now
//     },

//     unreadCount:[{
//         participantId:{
//             type:Schema.Types.ObjectId,
//             required:true
//         },
//         count:{
//             type:Number,
//             default:0
//         }
//     }]

    

// },
// {timestamps:true});

// chatSchema.index({ participantIds: 1 });

// const Chat =mongoose.model<IChat>("Chat",chatSchema);
// export{Chat,IChat};

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
