// mappers/progress/progressMapper.ts

import { IProgressResponseDto } from "../../dtos/progress/progressDto";
import { IProgress } from "../../model/progress/progress.model";


export function mapProgressToDto(progress: IProgress): IProgressResponseDto {
    return {
        _id: progress._id.toString(),
        studentId: progress.studentId.toString(),
        courseId: progress.courseId.toString(),
        completedLectures: progress.completedLectures.map(id => id.toString()),
        lastAccessedLecture: progress.lastAccessedLecture?.toString(),
        progressPercentage: progress.progressPercentage,
        isCompleted: progress.isCompleted,
        startDate: progress.startDate,
        lastAccessDate: progress.lastAccessDate,
        completionDate: progress.completionDate,
        createdAt: progress.createdAt,
        updatedAt: progress.updatedAt,
    };
}

export function mapProgressListToDto(progressList: IProgress[]): IProgressResponseDto[] {
    return progressList.map(mapProgressToDto);
}
