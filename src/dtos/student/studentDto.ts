
export interface IStudentDto {
    _id?:string;
    username?: string;
    email?: string;
    password?: string;
    status?: number;
    role: string;
    googleID?: String
    enrolledCourseCount?: number;
    profilePicture?: string;
    createdAt?: string;
    updatedAt?: string;
}