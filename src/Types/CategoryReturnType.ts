import { ICategory } from "../model/category/categoryModel";


export interface CategoryResponseDataType{
    categories: ICategory[],
    totalRecord : number
}