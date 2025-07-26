// src/mappers/notification.mapper.ts

import { INotificationDto } from "../../dtos/notification/notificationDto";
import { INotification } from "../../model/notification/notification.Model";



export const mapNotificationToDto = (notification: INotification): INotificationDto => {
  return {
    _id: notification._id.toString(),
    receiverId: notification.receiverId.toString(),
    content: notification.content,
    isRead: notification.isRead,
    createdAt: notification.createdAt?.toISOString(),
    updatedAt: notification.updatedAt?.toISOString(),
  };
};





export function mapNotificationsToDto(lectures: INotification[]): INotificationDto[] {
  return lectures.map(mapNotificationToDto);
}
