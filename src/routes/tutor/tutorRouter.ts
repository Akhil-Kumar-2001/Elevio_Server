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



const router = Router();
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

router.get("/get-tutor/:id",isBlocked,validateToken("Tutor"), tutorProfileController.getTutor.bind(tutorProfileController));
router.put("/verify-tutor",isBlocked,validateToken("Tutor"),tutorProfileController.verifyTutor.bind(tutorProfileController))
router.patch("/update-profile",isBlocked,validateToken("Tutor"),tutorProfileController.updateProfile.bind(tutorProfileController))

router.get("/get-categories",isBlocked,validateToken("Tutor"),tutorCourseController.getCategories.bind(tutorCourseController))
router.post("/create-course",isBlocked,validateToken("Tutor"),tutorCourseController.createCourse.bind(tutorCourseController))

router.get('/courses',validateToken("Tutor"),isBlocked,tutorCourseController.getCourses.bind(tutorCourseController))
router.get('/get-category',validateToken("Tutor"),isBlocked,tutorCourseController.getCourseDetails.bind(tutorCourseController))
router.post('/edit-course',validateToken('Tutor'),isBlocked,tutorCourseController.editCourse.bind(tutorCourseController))


export default  router