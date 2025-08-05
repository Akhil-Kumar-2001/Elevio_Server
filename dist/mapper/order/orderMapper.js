"use strict";
// mappers/OrderMapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOrdersToDto = exports.mapOrderToDto = void 0;
const mapOrderToDto = (order) => {
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
exports.mapOrderToDto = mapOrderToDto;
const mapOrdersToDto = (orders) => {
    return orders.map(exports.mapOrderToDto);
};
exports.mapOrdersToDto = mapOrdersToDto;
