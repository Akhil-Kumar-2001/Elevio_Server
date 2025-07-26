export interface ISubscriptionPurchasDto {
  _id: string;
  userId: string;
  planId: {
    _id: string;
    planName: string;
    price: number;
    duration: {
      value: number;
      unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
    };
    features: string[];
    status: boolean;
    createdAt: string;
    updatedAt: string;

  };
  orderId: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'expired' | 'canceled';
  paymentStatus: 'paid' | 'unpaid' | 'failed';
  paymentDetails: {
    paymentId: string;
    paymentMethod: 'Razorpay' | 'Stripe' | 'Paypal' | string;
    paymentAmount: number;
  };
  createdAt: string;
  updatedAt: string;

}
