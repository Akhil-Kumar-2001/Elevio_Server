import { ICategory } from '../../model/category/categoryModel';
import { ICategoryDto } from '../../dtos/category/categoryDto';

export const mapCategoryToDto = (category: ICategory): ICategoryDto => {
  return {
    _id: category._id.toString(),
    name: category.name,
    status: category.status,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};

export const mapCategoriesToDto = (categories: ICategory[]): ICategoryDto[] => {
  return categories.map(mapCategoryToDto);
};
