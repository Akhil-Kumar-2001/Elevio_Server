
export interface INotificationDto {
  _id: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt?: string;
  updatedAt?: string;
}
