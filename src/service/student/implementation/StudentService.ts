import { IOtpDto } from "../../../dtos/otp/IOtpDto";
import { IStudentDto } from "../../../dtos/student/studentDto";
import { mapOtpToDto } from "../../../mapper/otp/otpMapper";
import { mapStudentToDto } from "../../../mapper/student/studentMapper";
import { IStudent } from "../../../model/student/studentModel";
import IStudentRepository from "../../../repository/student/IStudentRepository";
import IStudentService from "../IStudentService";

class StudentService implements IStudentService {

    private _studentRepository: IStudentRepository;

    constructor(studentRepository: IStudentRepository) {
        this._studentRepository = studentRepository;
    }

    async findByEmail(email: string): Promise<IStudent | null> {
        const getUser = await this._studentRepository.findByEmail(email)
        return getUser
    }

    async createUser(username: string, email: string, password: string): Promise<IStudent | null> {
        const newUser = await this._studentRepository.create({ username, email, password })
        return newUser
    }
    async updateUser(email: string, data: IStudent): Promise<IStudentDto | null> {
        const updatedUser = await this._studentRepository.updateUserByEmail(email, data);
        return updatedUser
    }

    async updateUserStatus(email: string): Promise<IStudentDto | null> {
        const updatedUser = await this._studentRepository.updateUserStatus(email);
        if(!updatedUser)return null;
        const dto = mapStudentToDto(updatedUser)
        return dto
    }

    async storeUserOtp(email: string, otp: string): Promise<IOtpDto | null> {
        const storedOtp = await this._studentRepository.storeOtpInDb(email, otp);
        if(!storedOtp)return null
        const dto = mapOtpToDto(storedOtp)
        return dto
    }

    async getOtpByEmail(email: string): Promise<IOtpDto | null> {
        const otp = await this._studentRepository.findOtpByemail(email)
        if(!otp)return null
        const dto = mapOtpToDto(otp)
        return dto
    }
    async storeUserResendOtp(email: string, otp: string): Promise<IOtpDto | null> {
        const storedOtp = await this._studentRepository.storeResendOtpInDb(email, otp);
        if(!storedOtp)return null;
        const dto = mapOtpToDto(storedOtp)
        return dto
    }

    async isBlocked(_id: string): Promise<number | undefined> {
        const user = await this._studentRepository.isBlocked(_id);
        return user
    }

}
export default StudentService;