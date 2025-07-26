
export interface IProgressResponseDto {
    _id: string;
    studentId: string;
    courseId: string;
    completedLectures: string[];
    lastAccessedLecture?: string;
    progressPercentage: number;
    isCompleted: boolean;
    startDate: Date;
    lastAccessDate?: Date;
    completionDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
