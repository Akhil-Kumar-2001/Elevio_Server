import { Schema, Document, model, Types } from "mongoose";

// Define transaction types
type AdminTransaction = 'credit' | 'debit' | 'withdrawal' | 'refund' | 'commission' | 'system' | 'fee';

// Interface for admin wallet transactions
interface IAdminTransaction {
    amount: number;
    type: AdminTransaction;
    description: string;
    date: Date;
    relatedUserId?: Types.ObjectId; 
    referenceId?: Types.ObjectId; 
    userType?: 'Tutor' | 'Student';
}

// Admin Wallet Schema Interface
interface IAdminWallet extends Document {
    email: string;            
    balance: number;
    totalRevenue: number;    
    totalOutflow: number;   
    transactions: IAdminTransaction[];
    isActive: boolean;
    lastTransactionDate?: Date;
    _id: Types.ObjectId;
}

const adminTransactionSchema = new Schema<IAdminTransaction>({
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        enum: ['credit', 'debit', 'withdrawal'],
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
    relatedUserId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    userType: {
        type: String,
        enum: ['Tutor', 'Student'],
        default: null
    },
    referenceId: {
        type: Schema.Types.ObjectId,
        default: null
    }
});

const adminWalletSchema = new Schema<IAdminWallet>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    totalRevenue: {
        type: Number,
        default: 0,
        min: 0
    },
    totalOutflow: {
        type: Number,
        default: 0,
        min: 0
    },
    transactions: {
        type: [adminTransactionSchema],
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
adminWalletSchema.pre('save', function(next) {
    if (this.transactions.length > 0) {
        this.lastTransactionDate = this.transactions[this.transactions.length - 1].date;
    }
    next();
});

const AdminWallet = model<IAdminWallet>("AdminWallet", adminWalletSchema);

export { 
    AdminWallet, 
    IAdminWallet, 
    IAdminTransaction, 
    AdminTransaction 
};