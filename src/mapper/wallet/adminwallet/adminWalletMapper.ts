// src/utils/mappers/adminWalletMapper.ts

import { IAdminWalletdto, IAdminTransactionDto } from "../../../dtos/wallet/adminwallet/adminWalletDto";
import { IAdminWallet } from "../../../model/adminwallet/adminwallet";

type AllowedTransactionType = "credit" | "debit" | "withdrawal";

export const mapAdminTransactionToDto = (
  txn: IAdminWallet['transactions'][0]
): IAdminTransactionDto => {
  // Force narrow the type
  const allowedTypes: AllowedTransactionType[] = ["credit", "debit", "withdrawal"];

  const txnType = allowedTypes.includes(txn.type as AllowedTransactionType)
    ? (txn.type as AllowedTransactionType)
    : "credit"; // fallback or throw error

  return {
    amount: txn.amount,
    type: txnType,
    description: txn.description,
    date: txn.date,
    relatedUserId: txn.relatedUserId?.toString(),
    referenceId: txn.referenceId?.toString(),
    userType: txn.userType,
  };
};

export const mapAdminWalletToDto = (wallet: IAdminWallet): IAdminWalletdto => ({
  _id: wallet._id.toString(),
  balance: wallet.balance,
  transactions: wallet.transactions.map(mapAdminTransactionToDto),
  createdAt: wallet.createdAt,
  updatedAt: wallet.updatedAt,
  email: wallet.email,
  totalRevenue: wallet.totalRevenue,
  totalOutflow: wallet.totalOutflow,
  isActive: wallet.isActive,
});
