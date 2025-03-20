import Router from 'express';
import TutorRepository from '../../repository/tutor/implementation/TutorRepository';
import TutorService from '../../service/tutor/implementation/TutorService';
import TutorController from '../../controller/tutor/tutorController';
import TutorProfileRepository from '../../repository/tutor/implementation/TutorProfileRepository';
import TutorProfileService from '../../service/tutor/implementation/TutorProfileService';
import TutorProfileController from '../../controller/tutor/tutorProfileController';
import { validateToken } from '../../middleware/validateToken';
import isBlocked  from '../../middleware/isBlocked';
import TutorCourseRepository from '../../repository/tutor/implementation/TutorCourseRepository';
import TutorCourseService from '../../service/tutor/implementation/TutorCourseService';
import TutorCourseController from '../../controller/tutor/tutorCourseController';
import multer from 'multer';



const router = Router();

const upload = multer({ storage: multer.memoryStorage() });

const tutorRepository = new TutorRepository()
const tutorService = new TutorService(tutorRepository)
const tutorController = new TutorController(tutorService)

const tutorProfileRepository = new TutorProfileRepository()
const tutorProfileService = new TutorProfileService(tutorProfileRepository);
const tutorProfileController = new TutorProfileController(tutorProfileService);

const tutorCourseRepository = new TutorCourseRepository();
const tutorCourseService = new TutorCourseService(tutorCourseRepository);
const tutorCourseController = new TutorCourseController(tutorCourseService)


// sign-up routes

router.post('/signup',(req,res)=>tutorController.signupPost(req,res));
router.post('/verify-otp',(req,res)=>tutorController.verifyOtp(req,res));
router.post('/resend-otp',(req,res)=>tutorController.resendOtp(req,res));

// sign-in routes

router.post('/signin',(req,res)=>tutorController.signinPost(req,res));
router.post('/logout',(req,res)=>tutorController.logout(req,res))
router.post('/refresh-token',(req,res)=>tutorController.refreshToken(req,res));

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
router.post("/create-course",isBlocked,validateToken("Tutor"),tutorCourseController.createCourse.bind(tutorCourseController))
router.get('/courses',validateToken("Tutor"),isBlocked,tutorCourseController.getCourses.bind(tutorCourseController))
router.get('/get-category',validateToken("Tutor"),isBlocked,tutorCourseController.getCourseDetails.bind(tutorCourseController))
router.post('/edit-course',validateToken('Tutor'),isBlocked,tutorCourseController.editCourse.bind(tutorCourseController))


// Add Course Content
router.post('/create-section',isBlocked,validateToken("Tutor"),tutorCourseController.createSection.bind(tutorCourseController))
router.post('/create-lecture',isBlocked,validateToken("Tutor"),tutorCourseController.createLecture.bind(tutorCourseController))
router.get('/get-sections',isBlocked,validateToken("Tutor"),tutorCourseController.getSections.bind(tutorCourseController))
router.get('/get-lectures',isBlocked,validateToken("Tutor"),tutorCourseController.getLectures.bind(tutorCourseController))


// Edit and Delete Course Content
router.patch('/edit-lecture/:id',isBlocked,validateToken('Tutor'),tutorCourseController.editLecture.bind(tutorCourseController))
router.delete('/delete-lecture/:id',isBlocked,validateToken('Tutor'),tutorCourseController.deleteLecture.bind(tutorCourseController))

router.post('/lectures/upload-video',isBlocked,validateToken('Tutor'),upload.single('video'),tutorCourseController.uploadLectureVideo.bind(tutorCourseController));

router.patch('/apply-review',isBlocked,validateToken('Tutor'),tutorCourseController.applyReview.bind(tutorCourseController))


export default  router