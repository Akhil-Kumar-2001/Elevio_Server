import { ISubscriptionPurchasDto } from "../../dtos/subsription/isSubsriptionPurchasedDto";
import { ISubscriptionPurchasedExtended } from "../../model/subscription/SubscriptionPurchased";


export const mapSubscriptionPurchaseToDto = (
    subscription: ISubscriptionPurchasedExtended// populated plan
): ISubscriptionPurchasDto => {
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
            createdAt: subscription.planId.createdAt!.toString(),
            updatedAt: subscription.planId.updatedAt!.toString(),

        },
        orderId: subscription.orderId,
        startDate: subscription.startDate!.toISOString(),
        endDate: subscription.endDate!.toISOString(),
        status: subscription.status as any,
        paymentStatus: subscription.paymentStatus === 'pending' ? 'unpaid' : subscription.paymentStatus as any,
        paymentDetails: subscription.paymentDetails!,
        createdAt: new Date(subscription.createdAt).toISOString(),
        updatedAt: new Date(subscription.updatedAt).toISOString(),
    };
};
