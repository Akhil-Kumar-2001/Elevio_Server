import Router from 'express';
import TutorRepository from '../../repository/tutor/implementation/TutorRepository';
import TutorService from '../../service/tutor/implementation/TutorService';
import TutorController from '../../controller/tutor/implementation/TutorController';
import TutorProfileRepository from '../../repository/tutor/implementation/TutorProfileRepository';
import TutorProfileService from '../../service/tutor/implementation/TutorProfileService';
import TutorProfileController from '../../controller/tutor/implementation/TutorProfileController';
import { validateToken } from '../../middleware/validateToken';
import isBlocked  from '../../middleware/isBlocked';
import TutorCourseRepository from '../../repository/tutor/implementation/TutorCourseRepository';
import TutorCourseService from '../../service/tutor/implementation/TutorCourseService';
import TutorCourseController from '../../controller/tutor/implementation/TutorCourseController';
import multer from 'multer';
import ITutorController from '../../controller/tutor/ITutorController';
import ITutorProfileController from '../../controller/tutor/ITutorProfileController';
import ITutorCourseController from '../../controller/tutor/ITutorCourseController';
import TutorDashboardRepository from '../../repository/tutor/implementation/TutorDashboardRepository';
import TutorDashboardService from '../../service/tutor/implementation/TutorDashboardService';
import TutorDashboardController from '../../controller/tutor/implementation/TutorDashboardController';
import ITutorDashboardController from '../../controller/tutor/ITutorDashboardController';
import imageUpload from '../../Config/multerConfig'; // path as per your structure




const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

const tutorRepository = new TutorRepository()
const tutorService = new TutorService(tutorRepository)
const tutorController:ITutorController = new TutorController(tutorService)

const tutorProfileRepository = new TutorProfileRepository()
const tutorProfileService = new TutorProfileService(tutorProfileRepository);
const tutorProfileController : ITutorProfileController = new TutorProfileController(tutorProfileService);

const tutorCourseRepository = new TutorCourseRepository();
const tutorCourseService = new TutorCourseService(tutorCourseRepository);
const tutorCourseController : ITutorCourseController = new TutorCourseController(tutorCourseService)

const tutorDashboardRepository = new TutorDashboardRepository();
const tutorDashboardService = new TutorDashboardService(tutorDashboardRepository);
const tutorDashboardController:ITutorDashboardController = new TutorDashboardController(tutorDashboardService)


// sign-up routes

router.post('/signup',(req,res)=>tutorController.signupPost(req,res));
router.post('/verify-otp',(req,res)=>tutorController.verifyOtp(req,res));
router.post('/resend-otp', (req, res) => tutorController.resendOtp(req, res));


// sign-in routes

router.post('/signin',(req,res)=>tutorController.signinPost(req,res));
router.post('/logout',(req,res)=>tutorController.logout(req,res))
router.post('/refresh-token',tutorController.refreshToken.bind(tutorController));

// Forgot password

router.post('/forgot-password', tutorController.forgotPassword.bind(tutorController));
router.post('/verify-forgot-otp', tutorController.verifyForgotOtp.bind(tutorController));
router.post('/reset-password', tutorController.resetPassword.bind(tutorController));

router.post("/callback", tutorController.googleAuth.bind(tutorController));


// Tutor Profile
router.get("/get-tutor/:id",isBlocked,validateToken("Tutor"), tutorProfileController.getTutor.bind(tutorProfileController));
router.put("/verify-tutor",isBlocked,validateToken("Tutor"),tutorProfileController.verifyTutor.bind(tutorProfileController))
router.patch("/update-profile",isBlocked,validateToken("Tutor"),tutorProfileController.updateProfile.bind(tutorProfileController))


// Course creation
router.get("/get-categories",isBlocked,validateToken("Tutor"),tutorCourseController.getCategories.bind(tutorCourseController))
router.post("/create-course",isBlocked,validateToken("Tutor"),imageUpload.single('imageThumbnail'),tutorCourseController.createCourse.bind(tutorCourseController))
router.get('/courses',validateToken("Tutor"),isBlocked,tutorCourseController.getCourses.bind(tutorCourseController))
router.get('/get-category',validateToken("Tutor"),isBlocked,tutorCourseController.getCourseDetails.bind(tutorCourseController))
router.post('/edit-course',validateToken('Tutor'),isBlocked,imageUpload.single('imageThumbnail'),tutorCourseController.editCourse.bind(tutorCourseController))


// Add Course Content
router.post('/create-section',isBlocked,validateToken("Tutor"),tutorCourseController.createSection.bind(tutorCourseController))
router.post('/create-lecture',isBlocked,validateToken("Tutor"),tutorCourseController.createLecture.bind(tutorCourseController))
router.get('/get-sections',isBlocked,validateToken("Tutor"),tutorCourseController.getSections.bind(tutorCourseController))
router.get('/get-lectures',isBlocked,validateToken("Tutor"),tutorCourseController.getLectures.bind(tutorCourseController))


// Edit and Delete Course Content
router.patch('/edit-lecture/:id',isBlocked,validateToken('Tutor'),tutorCourseController.editLecture.bind(tutorCourseController))
router.delete('/delete-lecture/:id',isBlocked,validateToken('Tutor'),tutorCourseController.deleteLecture.bind(tutorCourseController))
router.patch('/edit-sections/:id',isBlocked,validateToken("Tutor"),tutorCourseController.editSection.bind(tutorCourseController))
router.post('/lectures/upload-video',isBlocked,validateToken('Tutor'),upload.single('video'),tutorCourseController.uploadLectureVideo.bind(tutorCourseController));

// Apply for Course Review
router.patch('/apply-review',isBlocked,validateToken('Tutor'),tutorCourseController.applyReview.bind(tutorCourseController))
router.get('/notifications',isBlocked,validateToken("Tutor"),tutorCourseController.getNotifications.bind(tutorCourseController))
router.patch('/notifications/:id',isBlocked,validateToken("Tutor"),tutorCourseController.readNotifications.bind(tutorCourseController))

//Student Management
router.get('/students',isBlocked,validateToken("Tutor"),tutorCourseController.getStudents.bind(tutorCourseController))

// Tutor Dashboard
router.get(`/monthly-income`,isBlocked,validateToken('Tutor'),tutorDashboardController.getMonthlyIncome.bind(tutorDashboardController))
router.get(`/students-count`,isBlocked,validateToken('Tutor'),tutorDashboardController.getStudentsCount.bind(tutorDashboardController))
router.get(`/transactions`,isBlocked,validateToken('Tutor'),tutorDashboardController.getTransactions.bind(tutorDashboardController));
router.get(`/dahboard-data`,isBlocked,validateToken('Tutor'),tutorDashboardController.getDashboradDetails.bind(tutorDashboardController));
router.get(`/yearly-income`,isBlocked,validateToken("Tutor"),tutorDashboardController.getYearlyIncome.bind(tutorDashboardController));
router.get(`/income-by-date-range`,isBlocked,validateToken("Tutor"),tutorDashboardController.getIncomeByDateRange.bind(tutorDashboardController));

//session routes
router.post(`/sessions`,isBlocked,validateToken("Tutor"),tutorProfileController.createSession.bind(tutorProfileController))
router.get(`/sessions`,isBlocked,validateToken("Tutor"),tutorProfileController.getSessions.bind(tutorProfileController))
router.get(`/session-details/:id`,validateToken("Tutor"),tutorProfileController.getSessionDetails.bind(tutorProfileController))
router.put(`/session-status/:id`,validateToken("Tutor"),tutorProfileController.updateSessionStatus.bind(tutorProfileController))

//course preview
router.get('/getcourse/:courseId',isBlocked,validateToken("Tutor"),tutorCourseController.getCoursePreview.bind(tutorCourseController))
router.get('/getsections/:courseId',isBlocked,validateToken("Tutor"),tutorCourseController.getSectionsPreview.bind(tutorCourseController))
router.get('/getlectures/:sectionId',isBlocked,validateToken("Tutor"),tutorCourseController.getLecturesPreview.bind(tutorCourseController))
router.get('/reviews/:courseId',isBlocked,validateToken("Tutor"),tutorCourseController.getReviews.bind(tutorCourseController))
router.post('/reply-review/:reviewId',isBlocked,validateToken("Tutor"),tutorCourseController.replyReview.bind(tutorCourseController))
router.delete('/delete-reply/:reviewId',isBlocked,validateToken("Tutor"),tutorCourseController.deleteReply.bind(tutorCourseController))

export default  router