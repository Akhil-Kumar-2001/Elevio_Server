import { ICategory } from "../../model/category/categoryModel"
import { ITutor } from "../../model/tutor/tutorModel"
import { CategoryResponseDataType } from "../../Types/CategoryReturnType"

interface IAdminTutorService {
    
    getPendingTutors():Promise<ITutor[] | null> 
    getTutorById(id:string):Promise<ITutor | null>
    rejectTutor(id:string):Promise<boolean | null>
    approveTutor(id:string):Promise<boolean | null>
    findCategory(name:string):Promise<boolean | null>
    createCategory(name:string):Promise <boolean | null>
    getCategories(page:number,limit:number):Promise<CategoryResponseDataType | null>
    blockCategory(id:string) : Promise < ICategory |null>
    deleteCategory(id:string) : Promise<boolean | null>
}

export default IAdminTutorService