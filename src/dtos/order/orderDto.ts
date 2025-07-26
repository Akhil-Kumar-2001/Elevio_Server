// dto/OrderDto.ts

export interface IOrderDto {
  _id: string;
  userId: string;
  courseIds: string[];
  razorpayOrderId: string;
  amount: number;
  status: "pending" | "success" | "failed";
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}
