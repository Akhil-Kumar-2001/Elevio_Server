import { IOtpDto } from "../../dtos/otp/IOtpDto";
import { OTPType } from "../../model/otp/ otpModel";

export const mapOtpToDto = (otpDoc: OTPType): IOtpDto => ({
  email: otpDoc.email,
  otp: otpDoc.otp,
  createdAt: otpDoc.createdAt?.toISOString() ?? new Date().toISOString(),
});
