"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorWallet = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Student",
        default: null
    },
    referenceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null
    }
});
const tutorWalletSchema = new mongoose_1.Schema({
    tutorId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const TutorWallet = (0, mongoose_1.model)("TutorWallet", tutorWalletSchema);
exports.TutorWallet = TutorWallet;
