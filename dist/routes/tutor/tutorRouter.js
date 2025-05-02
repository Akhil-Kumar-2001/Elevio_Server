"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TutorRepository_1 = __importDefault(require("../../repository/tutor/implementation/TutorRepository"));
const TutorService_1 = __importDefault(require("../../service/tutor/implementation/TutorService"));
const TutorController_1 = __importDefault(require("../../controller/tutor/implementation/TutorController"));
const TutorProfileRepository_1 = __importDefault(require("../../repository/tutor/implementation/TutorProfileRepository"));
const TutorProfileService_1 = __importDefault(require("../../service/tutor/implementation/TutorProfileService"));
const TutorProfileController_1 = __importDefault(require("../../controller/tutor/implementation/TutorProfileController"));
const validateToken_1 = require("../../middleware/validateToken");
const isBlocked_1 = __importDefault(require("../../middleware/isBlocked"));
const TutorCourseRepository_1 = __importDefault(require("../../repository/tutor/implementation/TutorCourseRepository"));
const TutorCourseService_1 = __importDefault(require("../../service/tutor/implementation/TutorCourseService"));
const TutorCourseController_1 = __importDefault(require("../../controller/tutor/implementation/TutorCourseController"));
const multer_1 = __importDefault(require("multer"));
const TutorDashboardRepository_1 = __importDefault(require("../../repository/tutor/implementation/TutorDashboardRepository"));
const TutorDashboardService_1 = __importDefault(require("../../service/tutor/implementation/TutorDashboardService"));
const TutorDashboardController_1 = __importDefault(require("../../controller/tutor/implementation/TutorDashboardController"));
const router = (0, express_1.default)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const tutorRepository = new TutorRepository_1.default();
const tutorService = new TutorService_1.default(tutorRepository);
const tutorController = new TutorController_1.default(tutorService);
const tutorProfileRepository = new TutorProfileRepository_1.default();
const tutorProfileService = new TutorProfileService_1.default(tutorProfileRepository);
const tutorProfileController = new TutorProfileController_1.default(tutorProfileService);
const tutorCourseRepository = new TutorCourseRepository_1.default();
const tutorCourseService = new TutorCourseService_1.default(tutorCourseRepository);
const tutorCourseController = new TutorCourseController_1.default(tutorCourseService);
const tutorDashboardRepository = new TutorDashboardRepository_1.default();
const tutorDashboardService = new TutorDashboardService_1.default(tutorDashboardRepository);
const tutorDashboardController = new TutorDashboardController_1.default(tutorDashboardService);
// sign-up routes
router.post('/signup', (req, res) => tutorController.signupPost(req, res));
router.post('/verify-otp', (req, res) => tutorController.verifyOtp(req, res));
router.post('/refresh-token', tutorController.refreshToken.bind(tutorController));
// sign-in routes
router.post('/signin', (req, res) => tutorController.signinPost(req, res));
router.post('/logout', (req, res) => tutorController.logout(req, res));
router.post('/refresh-token', (req, res) => tutorController.refreshToken(req, res));
// Forgot password
router.post('/forgot-password', tutorController.forgotPassword.bind(tutorController));
router.post('/verify-forgot-otp', tutorController.verifyForgotOtp.bind(tutorController));
router.post('/reset-password', tutorController.resetPassword.bind(tutorController));
router.post("/callback", tutorController.googleAuth.bind(tutorController));
// Tutor Profile
router.get("/get-tutor/:id", isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorProfileController.getTutor.bind(tutorProfileController));
router.put("/verify-tutor", isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorProfileController.verifyTutor.bind(tutorProfileController));
router.patch("/update-profile", isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorProfileController.updateProfile.bind(tutorProfileController));
// Course creation
router.get("/get-categories", isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.getCategories.bind(tutorCourseController));
router.post("/create-course", isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.createCourse.bind(tutorCourseController));
router.get('/courses', (0, validateToken_1.validateToken)("Tutor"), isBlocked_1.default, tutorCourseController.getCourses.bind(tutorCourseController));
router.get('/get-category', (0, validateToken_1.validateToken)("Tutor"), isBlocked_1.default, tutorCourseController.getCourseDetails.bind(tutorCourseController));
router.post('/edit-course', (0, validateToken_1.validateToken)('Tutor'), isBlocked_1.default, tutorCourseController.editCourse.bind(tutorCourseController));
// Add Course Content
router.post('/create-section', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.createSection.bind(tutorCourseController));
router.post('/create-lecture', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.createLecture.bind(tutorCourseController));
router.get('/get-sections', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.getSections.bind(tutorCourseController));
router.get('/get-lectures', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.getLectures.bind(tutorCourseController));
// Edit and Delete Course Content
router.patch('/edit-lecture/:id', isBlocked_1.default, (0, validateToken_1.validateToken)('Tutor'), tutorCourseController.editLecture.bind(tutorCourseController));
router.delete('/delete-lecture/:id', isBlocked_1.default, (0, validateToken_1.validateToken)('Tutor'), tutorCourseController.deleteLecture.bind(tutorCourseController));
router.patch('/edit-sections/:id', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.editSection.bind(tutorCourseController));
router.post('/lectures/upload-video', isBlocked_1.default, (0, validateToken_1.validateToken)('Tutor'), upload.single('video'), tutorCourseController.uploadLectureVideo.bind(tutorCourseController));
// Apply for Course Review
router.patch('/apply-review', isBlocked_1.default, (0, validateToken_1.validateToken)('Tutor'), tutorCourseController.applyReview.bind(tutorCourseController));
router.get('/notifications', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.getNotifications.bind(tutorCourseController));
router.patch('/notifications/:id', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.readNotifications.bind(tutorCourseController));
// Tutor Dashboard
router.get(`/monthly-income`, isBlocked_1.default, (0, validateToken_1.validateToken)('Tutor'), tutorDashboardController.getMonthlyIncome.bind(tutorDashboardController));
router.get(`/students-count`, isBlocked_1.default, (0, validateToken_1.validateToken)('Tutor'), tutorDashboardController.getStudentsCount.bind(tutorDashboardController));
router.get(`/transactions`, isBlocked_1.default, (0, validateToken_1.validateToken)('Tutor'), tutorDashboardController.getTransactions.bind(tutorDashboardController));
router.get(`/dahboard-data`, isBlocked_1.default, (0, validateToken_1.validateToken)('Tutor'), tutorDashboardController.getDashboradDetails.bind(tutorDashboardController));
router.get(`/yearly-income`, isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorDashboardController.getYearlyIncome.bind(tutorDashboardController));
router.get(`/income-by-date-range`, isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorDashboardController.getIncomeByDateRange.bind(tutorDashboardController));
//session routes
router.post(`/sessions`, isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorProfileController.createSession.bind(tutorProfileController));
router.get(`/sessions`, isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorProfileController.getSessions.bind(tutorProfileController));
router.get(`/session-details/:id`, (0, validateToken_1.validateToken)("Tutor"), tutorProfileController.getSessionDetails.bind(tutorProfileController));
router.put(`/session-status/:id`, (0, validateToken_1.validateToken)("Tutor"), tutorProfileController.updateSessionStatus.bind(tutorProfileController));
//course preview
router.get('/getcourse/:courseId', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.getCoursePreview.bind(tutorCourseController));
router.get('/getsections/:courseId', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.getSectionsPreview.bind(tutorCourseController));
router.get('/getlectures/:sectionId', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.getLecturesPreview.bind(tutorCourseController));
router.get('/reviews/:courseId', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.getReviews.bind(tutorCourseController));
router.post('/reply-review/:reviewId', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.replyReview.bind(tutorCourseController));
router.delete('/delete-reply/:reviewId', isBlocked_1.default, (0, validateToken_1.validateToken)("Tutor"), tutorCourseController.deleteReply.bind(tutorCourseController));
exports.default = router;
