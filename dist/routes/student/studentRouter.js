"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const StudentRepository_1 = __importDefault(require("../../repository/student/implementation/StudentRepository"));
const StudentService_1 = __importDefault(require("../../service/student/implementation/StudentService"));
const StudentController_1 = __importDefault(require("../../controller/student/implementation/StudentController"));
const StudentCourseRepository_1 = __importDefault(require("../../repository/student/implementation/StudentCourseRepository"));
const StudentCourseController_1 = __importDefault(require("../../controller/student/implementation/StudentCourseController"));
const StudentCourseService_1 = __importDefault(require("../../service/student/implementation/StudentCourseService"));
const StudentProfileRepository_1 = __importDefault(require("../../repository/student/implementation/StudentProfileRepository"));
const validateToken_1 = require("../../middleware/validateToken");
const StudentProfileService_1 = __importDefault(require("../../service/student/implementation/StudentProfileService"));
const StudentProfileController_1 = __importDefault(require("../../controller/student/implementation/StudentProfileController"));
const router = (0, express_1.default)();
const studentRepository = new StudentRepository_1.default();
const studentService = new StudentService_1.default(studentRepository);
const studentController = new StudentController_1.default(studentService);
const studentProfileRepository = new StudentProfileRepository_1.default();
const studentProfileService = new StudentProfileService_1.default(studentProfileRepository);
const studentProfileController = new StudentProfileController_1.default(studentProfileService);
const studentCourseRepository = new StudentCourseRepository_1.default();
const studentCourseService = new StudentCourseService_1.default(studentCourseRepository);
const studentCourseController = new StudentCourseController_1.default(studentCourseService);
// sign-up routes
router.post('/signup', (req, res) => studentController.signupPost(req, res));
router.post('/verify-otp', (req, res) => studentController.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => studentController.resendOtp(req, res));
// sign-in routes
router.post('/signin', studentController.signinPost.bind(studentController));
router.post('/logout', studentController.logout.bind(studentController));
router.post('/refresh-token', studentController.refreshToken.bind(studentController));
// router.post('/refresh-token', (req, res) => studentController.refreshToken(req, res));
// Forgot password
router.post('/forgot-password', studentController.forgotPassword.bind(studentController));
router.post('/verify-forgot-otp', studentController.verifyForgotOtp.bind(studentController));
router.post('/reset-password', studentController.resetPassword.bind(studentController));
// Google Authentication 
router.post("/callback", studentController.googleAuth.bind(studentController));
router.get('/listed-courses', (0, validateToken_1.validateToken)('Student'), studentCourseController.getListedCourse.bind(studentCourseController));
router.get('/top-rated', (0, validateToken_1.validateToken)('Student'), studentCourseController.getTopRatedCourse.bind(studentCourseController));
router.get('/get-student', (0, validateToken_1.validateToken)('Student'), studentProfileController.getStudent.bind(studentProfileController));
router.get('/get-subscription-details', (0, validateToken_1.validateToken)('Student'), studentProfileController.getSubscriptionDetails.bind(studentProfileController));
router.patch('/edit-profile/:id', (0, validateToken_1.validateToken)("Student"), studentProfileController.editProfile.bind(studentProfileController));
router.post('/addtocart/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.addToCart.bind(studentCourseController));
router.get(`/cart/:id`, (0, validateToken_1.validateToken)("Student"), studentCourseController.getCart.bind(studentCourseController));
router.delete('/remove-item/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.removeItem.bind(studentCourseController));
// Course Purchase
router.get("/search-courses", (0, validateToken_1.validateToken)("Student"), studentCourseController.searchCourse.bind(studentCourseController));
router.post("/payment/create-order", (0, validateToken_1.validateToken)("Student"), studentCourseController.createOrder.bind(studentCourseController));
router.post("/payment/verify-payment", (0, validateToken_1.validateToken)("Student"), studentCourseController.verifyPayment.bind(studentCourseController));
router.get('/getcategories', (0, validateToken_1.validateToken)("Student"), studentCourseController.getCategories.bind(studentCourseController));
router.get('/courses', (0, validateToken_1.validateToken)('Student'), studentCourseController.getCourses.bind(studentCourseController));
router.get('/purchased-courses/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.getPurchasedCourses.bind(studentCourseController));
router.get('/getCourse/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.getCourse.bind(studentCourseController));
router.get('/tutorDetails/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.getTutor.bind(studentCourseController));
router.get('/sections/:courseId', (0, validateToken_1.validateToken)('Student'), studentCourseController.getSections.bind(studentCourseController));
router.get('/lectures/:courseId', (0, validateToken_1.validateToken)('Student'), studentCourseController.getLectures.bind(studentCourseController));
//Subsription
router.get('/subscription', (0, validateToken_1.validateToken)("Student"), studentCourseController.getSubscription.bind(studentCourseController));
router.post('/subscription/create-order', (0, validateToken_1.validateToken)('Student'), studentCourseController.createSubscritionOrder.bind(studentCourseController));
router.post('/subscription/verify-payment', (0, validateToken_1.validateToken)('Student'), studentCourseController.verifySubscriptionPayment.bind(studentCourseController));
router.get('/reviews/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.getReviews.bind(studentCourseController));
router.post('/reviews', (0, validateToken_1.validateToken)("Student"), studentCourseController.createReview.bind(studentCourseController));
// Course Progress
router.get('/progress/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.getProgress.bind(studentCourseController));
router.post("/update-progress", (0, validateToken_1.validateToken)("Student"), studentCourseController.addLectureToProgress.bind(studentCourseController));
router.get('/sessions', (0, validateToken_1.validateToken)("Student"), studentProfileController.getSessions.bind(studentProfileController));
router.get(`/session-details/:id`, (0, validateToken_1.validateToken)("Student"), studentProfileController.getSessionDetails.bind(studentProfileController));
router.put(`/session-status/:id`, (0, validateToken_1.validateToken)("Student"), studentProfileController.updateSessionStatus.bind(studentProfileController));
router.put(`/edit-review/:id`, (0, validateToken_1.validateToken)("Student"), studentCourseController.editReview.bind(studentCourseController));
router.delete(`/delete-review/:id`, (0, validateToken_1.validateToken)("Student"), studentCourseController.deleteReview.bind(studentCourseController));
// Wishlist
router.get('/wishlist', (0, validateToken_1.validateToken)("Student"), studentCourseController.getWishlist.bind(studentCourseController));
router.post('/add-to-wishlist/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.addToWishlist.bind(studentCourseController));
router.delete('/remove-from-wishlist/:id', (0, validateToken_1.validateToken)("Student"), studentCourseController.removeFromWishlist.bind(studentCourseController));
exports.default = router;
