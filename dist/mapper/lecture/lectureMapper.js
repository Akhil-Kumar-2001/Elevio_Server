"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLectureToDto = mapLectureToDto;
exports.mapLecturesToDto = mapLecturesToDto;
function mapLectureToDto(lecture) {
    var _a, _b, _c;
    return {
        _id: lecture._id.toString(),
        sectionId: lecture.sectionId.toString(),
        courseId: lecture.courseId.toString(),
        title: lecture.title,
        videoUrl: (_a = lecture.videoUrl) !== null && _a !== void 0 ? _a : "",
        videoKey: (_b = lecture.videoKey) !== null && _b !== void 0 ? _b : "",
        duration: lecture.duration,
        order: lecture.order,
        status: lecture.status,
        isPreview: (_c = lecture.isPreview) !== null && _c !== void 0 ? _c : false,
        createdAt: lecture.createdAt,
        updatedAt: lecture.updatedAt,
    };
}
function mapLecturesToDto(lectures) {
    return lectures.map(mapLectureToDto);
}
