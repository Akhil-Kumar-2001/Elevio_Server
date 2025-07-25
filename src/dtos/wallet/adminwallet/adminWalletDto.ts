
export interface IAdminTransactionDto {
    amount: number;
    type: 'credit' | 'debit' | 'withdrawal';
    description: string;
    date: Date;
    relatedUserId?: string;
    referenceId?: string;
    userType?: 'Tutor' | 'Student';
}

export interface IAdminWalletdto {
    _id?: string;
    email: string;
    balance: number;
    totalRevenue: number;
    totalOutflow: number;
    transactions: IAdminTransactionDto[];
    isActive: boolean;
    lastTransactionDate?: Date;
    createdAt?: string;
    updatedAt?: string;
}