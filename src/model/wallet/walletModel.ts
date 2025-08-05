import { Schema, Document, model, Types } from "mongoose";

// Define transaction types
type TransactionType = 'credit' | 'debit' | 'withdrawal' | 'refund' | 'commission';

// Interface for wallet transactions
interface ITransaction {
    _id?: string;
    amount: number;
    type: TransactionType;
    description: string;
    date: Date;
    studentId?: Schema.Types.ObjectId;
    referenceId?: Types.ObjectId;
}

// Wallet Schema Interface
interface ITutorWallet extends Document {
    tutorId: Types.ObjectId;
    balance: number;
    totalEarnings: number;
    totalWithdrawn: number;
    transactions: ITransaction[];
    isActive: boolean;
    lastTransactionDate?: Date;
    _id: Types.ObjectId;
    createdAt: string,
    updatedAt: string,
}

const transactionSchema = new Schema<ITransaction>({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ['credit', 'debit', 'withdrawal', 'refund', 'commission'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        default: null
    },
    referenceId: {
        type: Schema.Types.ObjectId,
        default: null
    }
});

const tutorWalletSchema = new Schema<ITutorWallet>({
    tutorId: {
        type: Schema.Types.ObjectId,
        ref: "Tutor", // Assuming you have a User model
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    totalEarnings: {
        type: Number,
        default: 0,
        min: 0
    },
    totalWithdrawn: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: {
        type: [transactionSchema],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastTransactionDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Pre-save middleware to update lastTransactionDate
tutorWalletSchema.pre('save', function (next) {
    if (this.transactions.length > 0) {
        this.lastTransactionDate = this.transactions[this.transactions.length - 1].date;
    }
    next();
});

const TutorWallet = model<ITutorWallet>("TutorWallet", tutorWalletSchema);

export {
    TutorWallet,
    ITutorWallet,
    ITransaction,
    TransactionType
};