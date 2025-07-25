import { ILectureDto } from "../../dtos/lecture/ILectureDto";
import { ILecture } from "../../model/lecture/lectureModel";


export function mapLectureToDto(lecture: ILecture): ILectureDto {
  return {
    _id: lecture._id.toString(),
    sectionId: lecture.sectionId.toString(),
    courseId: lecture.courseId.toString(),
    title: lecture.title,
    videoUrl: lecture.videoUrl ?? "",
    duration: lecture.duration,
    order: lecture.order,
    status: lecture.status,
    isPreview: lecture.isPreview ?? false,
    createdAt: lecture.createdAt,
    updatedAt: lecture.updatedAt,
  };
}

export function mapLecturesToDto(lectures: ILecture[]): ILectureDto[] {
  return lectures.map(mapLectureToDto);
}
