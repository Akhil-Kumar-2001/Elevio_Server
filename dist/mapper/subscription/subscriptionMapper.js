"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSubscriptionsToDto = exports.mapSubscriptionToDto = void 0;
const mapSubscriptionToDto = (subscription) => {
    return {
        _id: subscription._id,
        planName: subscription.planName,
        duration: {
            value: subscription.duration.value,
            unit: subscription.duration.unit,
        },
        price: subscription.price,
        features: subscription.features,
        status: subscription.status,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
    };
};
exports.mapSubscriptionToDto = mapSubscriptionToDto;
const mapSubscriptionsToDto = (subscriptions) => {
    return subscriptions.map(exports.mapSubscriptionToDto);
};
exports.mapSubscriptionsToDto = mapSubscriptionsToDto;
