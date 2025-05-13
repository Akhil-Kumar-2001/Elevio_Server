"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminWallet = void 0;
const mongoose_1 = require("mongoose");
const adminTransactionSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        default: null
    },
    userType: {
        type: String,
        enum: ['Tutor', 'Student'],
        default: null
    },
    referenceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null
    }
});
const adminWalletSchema = new mongoose_1.Schema({
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
adminWalletSchema.pre('save', function (next) {
    if (this.transactions.length > 0) {
        this.lastTransactionDate = this.transactions[this.transactions.length - 1].date;
    }
    next();
});
const AdminWallet = (0, mongoose_1.model)("AdminWallet", adminWalletSchema);
exports.AdminWallet = AdminWallet;
