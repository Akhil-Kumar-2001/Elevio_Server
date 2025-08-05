"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSubscriptionPurchaseToDto = void 0;
const mapSubscriptionPurchaseToDto = (subscription // populated plan
) => {
    return {
        _id: subscription._id.toString(),
        userId: subscription.userId.toString(),
        planId: {
            _id: subscription.planId._id.toString(),
            planName: subscription.planId.planName,
            price: subscription.planId.price,
            duration: subscription.planId.duration,
            features: subscription.planId.features,
            status: subscription.planId.status,
            createdAt: subscription.planId.createdAt.toString(),
            updatedAt: subscription.planId.updatedAt.toString(),
        },
        orderId: subscription.orderId,
        startDate: subscription.startDate.toISOString(),
        endDate: subscription.endDate.toISOString(),
        status: subscription.status,
        paymentStatus: subscription.paymentStatus === 'pending' ? 'unpaid' : subscription.paymentStatus,
        paymentDetails: subscription.paymentDetails,
        createdAt: new Date(subscription.createdAt).toISOString(),
        updatedAt: new Date(subscription.updatedAt).toISOString(),
    };
};
exports.mapSubscriptionPurchaseToDto = mapSubscriptionPurchaseToDto;
