import { ISubscriptionDto } from "../../dtos/subsription/subscriptionDto";
import { ISubscription } from "../../model/subscription/subscriptionModel";


export const mapSubscriptionToDto = (subscription: ISubscription): ISubscriptionDto => {
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
    createdAt: subscription.createdAt?.toISOString() || '',
    updatedAt: subscription.updatedAt?.toISOString() || '',
  };
};


export const mapSubscriptionsToDto = (subscriptions: ISubscription[]): ISubscriptionDto[] => {
  return subscriptions.map(mapSubscriptionToDto);
};
