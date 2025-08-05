"use strict";
// src/utils/mappers/adminWalletMapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAdminWalletToDto = exports.mapAdminTransactionToDto = void 0;
const mapAdminTransactionToDto = (txn) => {
    var _a, _b;
    // Force narrow the type
    const allowedTypes = ["credit", "debit", "withdrawal"];
    const txnType = allowedTypes.includes(txn.type)
        ? txn.type
        : "credit"; // fallback or throw error
    return {
        amount: txn.amount,
        type: txnType,
        description: txn.description,
        date: txn.date,
        relatedUserId: (_a = txn.relatedUserId) === null || _a === void 0 ? void 0 : _a.toString(),
        referenceId: (_b = txn.referenceId) === null || _b === void 0 ? void 0 : _b.toString(),
        userType: txn.userType,
    };
};
exports.mapAdminTransactionToDto = mapAdminTransactionToDto;
const mapAdminWalletToDto = (wallet) => ({
    _id: wallet._id.toString(),
    balance: wallet.balance,
    transactions: wallet.transactions.map(exports.mapAdminTransactionToDto),
    createdAt: wallet.createdAt,
    updatedAt: wallet.updatedAt,
    email: wallet.email,
    totalRevenue: wallet.totalRevenue,
    totalOutflow: wallet.totalOutflow,
    isActive: wallet.isActive,
});
exports.mapAdminWalletToDto = mapAdminWalletToDto;
