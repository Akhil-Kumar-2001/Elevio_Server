export interface ITutorDto {
    _id:string;
    username: string;
    email: string;
    role: string;
    status?: number;
    isVerified: string;
    profile: {
        bio?: string;
        profilePicture?: string;
        qualification?: string;
        experience?: string;
        skills?: string[];
        documents?: {
            type: string;
            fileUrl: string;
        }[];
    };
    createdAt?: string;
    updatedAt?: string;
}