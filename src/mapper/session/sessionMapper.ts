import { ISessionDto } from "../../dtos/session/sessionDto";
import { ISession } from "../../model/sessiion/sessionModel";

export const mapSessionToDto = (session: ISession): ISessionDto => {
  return {
    id: session._id.toString(),
    tutorId: session.tutorId,
    studentId: session.studentId,
    startTime: session.startTime.toISOString(),
    duration: session.duration,
    roomId: session.roomId,
    status: session.status,
    createdAt: session.createdAt?.toISOString(),
  };
};

export const mapSessionsToDtos = (sessions: ISession[]): ISessionDto[] => {
  return sessions.map(mapSessionToDto);
};
