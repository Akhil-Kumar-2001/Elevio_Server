"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCategoriesToDto = exports.mapCategoryToDto = void 0;
const mapCategoryToDto = (category) => {
    return {
        _id: category._id.toString(),
        name: category.name,
        status: category.status,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
    };
};
exports.mapCategoryToDto = mapCategoryToDto;
const mapCategoriesToDto = (categories) => {
    return categories.map(exports.mapCategoryToDto);
};
exports.mapCategoriesToDto = mapCategoriesToDto;
