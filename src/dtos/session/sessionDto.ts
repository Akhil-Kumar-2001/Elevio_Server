export interface ISessionDto {
  id?: string;
  tutorId: string;
  studentId: string;
  startTime: string; 
  duration: number;  
  roomId: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  createdAt?: string;
}
