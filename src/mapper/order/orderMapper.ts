// mappers/OrderMapper.ts

import { IOrderDto } from "../../dtos/order/orderDto";
import { IOrder } from "../../model/order/orderModel";


export const mapOrderToDto = (order: IOrder): IOrderDto => {
  return {
    _id: order._id.toString(),
    userId: order.userId.toString(),
    courseIds: order.courseIds.map((id) => id.toString()),
    razorpayOrderId: order.razorpayOrderId,
    amount: order.amount,
    status: order.status,
    paymentMethod: order.paymentMethod,
    createdAt: order.createdAt.toString(),
    updatedAt: order.updatedAt.toString(),
  };
};

export const mapOrdersToDto = (orders: IOrder[]): IOrderDto[] => {
  return orders.map(mapOrderToDto);
};
