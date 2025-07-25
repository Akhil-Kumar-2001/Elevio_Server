// dtos/tutorWallet.dto.ts

export interface ITransactionDto {
  _id?: string;
  amount?: number;
  type?: 'credit' | 'debit' | 'withdrawal' | 'refund' | 'commission';
  description?: string;
  date?: string; // ISO format
  studentId?: string | null;
  referenceId?: string | null;
}

export interface ITutorWalletDto {
  _id?: string;
  tutorId?: string;
  balance?: number;
  totalEarnings?: number;
  totalWithdrawn?: number;
  transactions?: ITransactionDto[];
  isActive?: boolean;
  lastTransactionDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}
