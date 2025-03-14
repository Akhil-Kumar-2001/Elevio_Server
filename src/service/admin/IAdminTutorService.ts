import { ICategory } from "../../model/category/categoryModel"
import { ITutor } from "../../model/tutor/tutorModel"

interface IAdminTutorService {
    
    getPendingTutors():Promise<ITutor[] | null> 
    getTutorById(id:string):Promise<ITutor | null>
    rejectTutor(id:string):Promise<boolean | null>
    approveTutor(id:string):Promise<boolean | null>
    findCategory(name:string):Promise<boolean | null>
    createCategory(name:string):Promise <boolean | null>
    getCategories():Promise<ICategory[] | null>
    blockCategory(id:string) : Promise < ICategory |null>
}

export default IAdminTutorService