import { ITransactionDto, ITutorWalletDto } from "../../../dtos/wallet/tutorwallet/tutorWalletDto";
import { ITutorWallet } from "../../../model/wallet/walletModel";
import { PaginatedResponse } from "../../../Types/CategoryReturnType";

export const mapTransactionToDto = (txn: ITutorWallet['transactions'][0]): ITransactionDto => ({
  _id: txn._id,
  amount: txn.amount,
  type: txn.type,
  description: txn.description,
  date: txn.date.toISOString(),
  studentId: txn.studentId?.toString() ?? null,
  referenceId: txn.referenceId?.toString() ?? null,
});

export const mapTutorWalletToDto = (wallet: ITutorWallet): ITutorWalletDto => ({
  _id: wallet._id.toString(),
  tutorId: wallet.tutorId.toString(),
  balance: wallet.balance,
  totalEarnings: wallet.totalEarnings,
  totalWithdrawn: wallet.totalWithdrawn,
  transactions: wallet.transactions.map(mapTransactionToDto),
  isActive: wallet.isActive,
  lastTransactionDate: wallet.lastTransactionDate?.toISOString() ?? null,
  createdAt: wallet.createdAt,
  updatedAt: wallet.updatedAt,
});

// ✅ Map a paginated list of tutor wallets
export const mapTutorWalletsToPaginatedDto = (
  wallets: ITutorWallet[],
  total: number
): PaginatedResponse<ITutorWalletDto> => ({
  data: wallets.map(mapTutorWalletToDto),
  totalRecord: total,
});
