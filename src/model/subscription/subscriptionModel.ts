import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
    planName: string;
    duration: {
        value: number;
        unit: "day" | "month" | "quarter" | "year";
    }
    price: number;
    features: string[];
    status: boolean;
    createdAt?: Date;
    updatedAt?: Date;

}

const SubscriptionSchema = new Schema<ISubscription>(

    {
        planName: { 
            type: String, 
            required: true 
        },
        duration: {
            value: { 
                type: Number, 
                required: true 
            },
            unit: { 
                type: String, 
                enum: ["day", "month",'quarter', "year"], 
                required: true 
            }
        },
        price: { 
            type: Number, 
            required: true 
        },
        features: { 
            type: [String], 
            required: true 
        },
        status: { 
            type: Boolean, 
            required: true 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        updatedAt: { 
            type: Date, 
            default: Date.now 
        }
    }

)

const Subscription = mongoose.model<ISubscription>("Subscription", SubscriptionSchema)

export default Subscription