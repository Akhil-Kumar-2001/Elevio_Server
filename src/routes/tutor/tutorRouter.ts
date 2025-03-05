import Router from 'express';
import TutorRepository from '../../repository/tutor/implementation/TutorRepository';
import TutorService from '../../service/tutor/implementation/TutorService';
import TutorController from '../../controller/tutor/tutorController';
import TutorProfileRepository from '../../repository/tutor/implementation/TutorProfileRepository';
import TutorProfileService from '../../service/tutor/implementation/TutorProfileService';
import TutorProfileController from '../../controller/tutor/tutorProfileController';



const router = Router();
const tutorRepository = new TutorRepository()
const tutorService = new TutorService(tutorRepository)
const tutorController = new TutorController(tutorService)

const tutorProfileRepository = new TutorProfileRepository()
const tutorProfileService = new TutorProfileService(tutorProfileRepository);
const tutorProfileController = new TutorProfileController(tutorProfileService)


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

router.get("/get-tutor/:id", tutorProfileController.getTutor.bind(tutorProfileController));
router.put("/verify-tutor",tutorProfileController.verifyTutor.bind(tutorProfileController))


export default  router