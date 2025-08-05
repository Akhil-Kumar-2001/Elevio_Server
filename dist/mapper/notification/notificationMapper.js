"use strict";
// src/mappers/notification.mapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapNotificationToDto = void 0;
exports.mapNotificationsToDto = mapNotificationsToDto;
const mapNotificationToDto = (notification) => {
    var _a, _b;
    return {
        _id: notification._id.toString(),
        receiverId: notification.receiverId.toString(),
        content: notification.content,
        isRead: notification.isRead,
        createdAt: (_a = notification.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
        updatedAt: (_b = notification.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
    };
};
exports.mapNotificationToDto = mapNotificationToDto;
function mapNotificationsToDto(lectures) {
    return lectures.map(exports.mapNotificationToDto);
}
