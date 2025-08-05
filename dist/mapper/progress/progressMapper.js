"use strict";
// mappers/progress/progressMapper.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapProgressToDto = mapProgressToDto;
exports.mapProgressListToDto = mapProgressListToDto;
function mapProgressToDto(progress) {
    var _a;
    return {
        _id: progress._id.toString(),
        studentId: progress.studentId.toString(),
        courseId: progress.courseId.toString(),
        completedLectures: progress.completedLectures.map(id => id.toString()),
        lastAccessedLecture: (_a = progress.lastAccessedLecture) === null || _a === void 0 ? void 0 : _a.toString(),
        progressPercentage: progress.progressPercentage,
        isCompleted: progress.isCompleted,
        startDate: progress.startDate,
        lastAccessDate: progress.lastAccessDate,
        completionDate: progress.completionDate,
        createdAt: progress.createdAt,
        updatedAt: progress.updatedAt,
    };
}
function mapProgressListToDto(progressList) {
    return progressList.map(mapProgressToDto);
}
