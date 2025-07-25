import { ISectionDto } from "../../dtos/section/ISectionDto";
import { ISection } from "../../model/section/sectionModel";

export const MapToSectionDto = (section: ISection): ISectionDto => {
  return {
    _id: section._id,
    courseId: section.courseId.toString(),
    title: section.title,
    description: section.description,
    order: section.order,
    totalLectures: section.totalLectures ?? 0,
    totalDuration: section.totalDuration ?? 0,
    isPublished: section.isPublished ?? false,
    createdAt: section.createdAt,
    updatedAt: section.updatedAt,
  };
};

export const MapToSectionsDto = (sections: ISection[]): ISectionDto[] => {
  return sections.map(MapToSectionDto);
};
