import Router from 'express';
import StudentRepository from '../../repository/student/implementation/StudentRepository';
import StudentService from '../../service/student/implementation/StudentService';
import StudentController from '../../controller/student/implementation/StudentController';
import StudentCourseRepository from '../../repository/student/implementation/StudentCourseRepository';
import StudentCourseController from '../../controller/student/implementation/StudentCourseController';
import StudentCourseService from '../../service/student/implementation/StudentCourseService';
import IStudentCourseController from '../../controller/student/IStudentCourseController';
import IStudentController from '../../controller/student/IStudentController';
import StudentProfileRepository from '../../repository/student/implementation/StudentProfileRepository'
import { validateToken } from '../../middleware/validateToken';
import StudentProfileService from '../../service/student/implementation/StudentProfileService';
import StudentProfileController from '../../controller/student/implementation/StudentProfileController';
import IStudentProfileController from '../../controller/student/IStudentProfileController';


const router = Router();
const studentRepository = new StudentRepository();
const studentService = new StudentService(studentRepository);
const studentController:IStudentController = new StudentController(studentService);

const studentProfileRepository = new StudentProfileRepository()
const studentProfileService = new StudentProfileService(studentProfileRepository);
const studentProfileController:IStudentProfileController = new StudentProfileController(studentProfileService)

const studentCourseRepository = new StudentCourseRepository();
const studentCourseService = new StudentCourseService(studentCourseRepository);
const studentCourseController:IStudentCourseController = new StudentCourseController(studentCourseService)


// sign-up routes

router.post('/signup', (req, res) => studentController.signupPost(req, res));
router.post('/verify-otp', (req, res) => studentController.verifyOtp(req, res));
router.post('/resend-otp', (req, res) => studentController.resendOtp(req, res));

// sign-in routes

router.post('/signin', studentController.signinPost.bind(studentController));
router.post('/logout', studentController.logout.bind(studentController));
router.post('/refresh-token',studentController.refreshToken.bind(studentController));
// router.post('/refresh-token', (req, res) => studentController.refreshToken(req, res));

// Forgot password

router.post('/forgot-password', studentController.forgotPassword.bind(studentController));
router.post('/verify-forgot-otp', studentController.verifyForgotOtp.bind(studentController));
router.post('/reset-password', studentController.resetPassword.bind(studentController));

// Google Authentication 

router.post("/callback", studentController.googleAuth.bind(studentController));


router.get('/listed-courses',validateToken('Student'),studentCourseController.getListedCourse.bind(studentCourseController));
router.get('/top-rated',validateToken('Student'),studentCourseController.getTopRatedCourse.bind(studentCourseController));


router.get('/get-student',validateToken('Student'),studentProfileController.getStudent.bind(studentProfileController));
router.get('/get-subscription-details',validateToken('Student'),studentProfileController.getSubscriptionDetails.bind(studentProfileController))
router.patch('/edit-profile/:id',validateToken("Student"),studentProfileController.editProfile.bind(studentProfileController))

router.post('/addtocart/:id',validateToken("Student"),studentCourseController.addToCart.bind(studentCourseController))
router.get(`/cart/:id`,validateToken("Student"),studentCourseController.getCart.bind(studentCourseController))
router.delete('/remove-item/:id',validateToken("Student"),studentCourseController.removeItem.bind(studentCourseController))


// Course Purchase

router.get("/search-courses",validateToken("Student"),studentCourseController.searchCourse.bind(studentCourseController))
router.post("/payment/create-order",validateToken("Student"),studentCourseController.createOrder.bind(studentCourseController))
router.post("/payment/verify-payment",validateToken("Student"),studentCourseController.verifyPayment.bind(studentCourseController))
router.get('/getcategories',validateToken("Student"),studentCourseController.getCategories.bind(studentCourseController))
router.get('/courses',validateToken('Student'),studentCourseController.getCourses.bind(studentCourseController))
router.get('/purchased-courses/:id',validateToken("Student"),studentCourseController.getPurchasedCourses.bind(studentCourseController))

router.get('/getCourse/:id',validateToken("Student"),studentCourseController.getCourse.bind(studentCourseController));
router.get('/tutorDetails/:id',validateToken("Student"),studentCourseController.getTutor.bind(studentCourseController))
router.get('/sections/:courseId',validateToken('Student'),studentCourseController.getSections.bind(studentCourseController))
router.get('/lectures/:courseId',validateToken('Student'),studentCourseController.getLectures.bind(studentCourseController))

//Subsription
router.get('/subscription',validateToken("Student"),studentCourseController.getSubscription.bind(studentCourseController))
router.post('/subscription/create-order',validateToken('Student'),studentCourseController.createSubscritionOrder.bind(studentCourseController))
router.post('/subscription/verify-payment',validateToken('Student'),studentCourseController.verifySubscriptionPayment.bind(studentCourseController))

router.get('/reviews/:id',validateToken("Student"),studentCourseController.getReviews.bind(studentCourseController));
router.post('/reviews',validateToken("Student"),studentCourseController.createReview.bind(studentCourseController));

// Course Progress
router.get('/progress/:id',validateToken("Student"),studentCourseController.getProgress.bind(studentCourseController))
router.post("/update-progress",validateToken("Student"),studentCourseController.addLectureToProgress.bind(studentCourseController))

router.get('/sessions',validateToken("Student"),studentProfileController.getSessions.bind(studentProfileController))
router.get(`/session-details/:id`,validateToken("Student"),studentProfileController.getSessionDetails.bind(studentProfileController))
router.put(`/session-status/:id`,validateToken("Student"),studentProfileController.updateSessionStatus.bind(studentProfileController))
router.put(`/edit-review/:id`,validateToken("Student"),studentCourseController.editReview.bind(studentCourseController))
router.delete(`/delete-review/:id`,validateToken("Student"),studentCourseController.deleteReview.bind(studentCourseController))

// Wishlist
router.get('/wishlist',validateToken("Student"),studentCourseController.getWishlist.bind(studentCourseController));
router.post('/add-to-wishlist/:id',validateToken("Student"),studentCourseController.addToWishlist.bind(studentCourseController));
router.delete('/remove-from-wishlist/:id',validateToken("Student"),studentCourseController.removeFromWishlist.bind(studentCourseController));




export default router;