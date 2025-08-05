"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTutorWalletsToPaginatedDto = exports.mapTutorWalletToDto = exports.mapTransactionToDto = void 0;
const mapTransactionToDto = (txn) => {
    var _a, _b, _c, _d;
    return ({
        _id: txn._id,
        amount: txn.amount,
        type: txn.type,
        description: txn.description,
        date: txn.date.toISOString(),
        studentId: (_b = (_a = txn.studentId) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null,
        referenceId: (_d = (_c = txn.referenceId) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : null,
    });
};
exports.mapTransactionToDto = mapTransactionToDto;
const mapTutorWalletToDto = (wallet) => {
    var _a, _b;
    return ({
        _id: wallet._id.toString(),
        tutorId: wallet.tutorId.toString(),
        balance: wallet.balance,
        totalEarnings: wallet.totalEarnings,
        totalWithdrawn: wallet.totalWithdrawn,
        transactions: wallet.transactions.map(exports.mapTransactionToDto),
        isActive: wallet.isActive,
        lastTransactionDate: (_b = (_a = wallet.lastTransactionDate) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : null,
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt,
    });
};
exports.mapTutorWalletToDto = mapTutorWalletToDto;
// ✅ Map a paginated list of tutor wallets
const mapTutorWalletsToPaginatedDto = (wallets, total) => ({
    data: wallets.map(exports.mapTutorWalletToDto),
    totalRecord: total,
});
exports.mapTutorWalletsToPaginatedDto = mapTutorWalletsToPaginatedDto;
