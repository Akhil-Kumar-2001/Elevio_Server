"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapToSectionsDto = exports.MapToSectionDto = void 0;
const MapToSectionDto = (section) => {
    var _a, _b, _c;
    return {
        _id: section._id,
        courseId: section.courseId.toString(),
        title: section.title,
        description: section.description,
        order: section.order,
        totalLectures: (_a = section.totalLectures) !== null && _a !== void 0 ? _a : 0,
        totalDuration: (_b = section.totalDuration) !== null && _b !== void 0 ? _b : 0,
        isPublished: (_c = section.isPublished) !== null && _c !== void 0 ? _c : false,
        createdAt: section.createdAt,
        updatedAt: section.updatedAt,
    };
};
exports.MapToSectionDto = MapToSectionDto;
const MapToSectionsDto = (sections) => {
    return sections.map(exports.MapToSectionDto);
};
exports.MapToSectionsDto = MapToSectionsDto;
