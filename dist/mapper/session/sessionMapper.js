"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSessionsToDtos = exports.mapSessionToDto = void 0;
const mapSessionToDto = (session) => {
    var _a;
    return {
        id: session._id.toString(),
        tutorId: session.tutorId,
        studentId: session.studentId,
        startTime: session.startTime.toISOString(),
        duration: session.duration,
        roomId: session.roomId,
        status: session.status,
        createdAt: (_a = session.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
    };
};
exports.mapSessionToDto = mapSessionToDto;
const mapSessionsToDtos = (sessions) => {
    return sessions.map(exports.mapSessionToDto);
};
exports.mapSessionsToDtos = mapSessionsToDtos;
