"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOtpToDto = void 0;
const mapOtpToDto = (otpDoc) => {
    var _a, _b;
    return ({
        email: otpDoc.email,
        otp: otpDoc.otp,
        createdAt: (_b = (_a = otpDoc.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString()) !== null && _b !== void 0 ? _b : new Date().toISOString(),
    });
};
exports.mapOtpToDto = mapOtpToDto;
