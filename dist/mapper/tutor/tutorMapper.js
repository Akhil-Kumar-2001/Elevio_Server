"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapTutorsToDto = exports.mapTutorToDto = void 0;
const mapTutorToDto = (tutor) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
        _id: tutor._id,
        username: tutor.username,
        email: tutor.email,
        role: tutor.role,
        status: tutor.status,
        isVerified: tutor.isVerified,
        profile: {
            bio: (_a = tutor.profile) === null || _a === void 0 ? void 0 : _a.bio,
            profilePicture: (_b = tutor.profile) === null || _b === void 0 ? void 0 : _b.profilePicture,
            qualification: (_c = tutor.profile) === null || _c === void 0 ? void 0 : _c.qualification,
            experience: (_d = tutor.profile) === null || _d === void 0 ? void 0 : _d.experience,
            skills: ((_e = tutor.profile) === null || _e === void 0 ? void 0 : _e.skills) || [],
            documents: ((_g = (_f = tutor.profile) === null || _f === void 0 ? void 0 : _f.documents) === null || _g === void 0 ? void 0 : _g.map(doc => ({
                type: doc.type,
                fileUrl: doc.fileUrl
            }))) || []
        },
        createdAt: tutor.createdAt,
        updatedAt: tutor.updatedAt,
    };
};
exports.mapTutorToDto = mapTutorToDto;
const mapTutorsToDto = (tutors) => {
    return tutors.map(exports.mapTutorToDto);
};
exports.mapTutorsToDto = mapTutorsToDto;
