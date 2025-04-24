import Router from 'express';
import AdminRepository from '../../repository/admin/implementation/AdminRepository';
import AdminService from '../../service/admin/Implementation/AdminService';
import AdminController from '../../controller/admin/implementation/AdminController';
import { validateToken } from '../../middleware/validateToken';
import AdminTutorController from '../../controller/admin/implementation/AdminTutorController';
import AdminTutorRepository from '../../repository/admin/implementation/AdminTutorRepository'
import AdminTutorService from '../../service/admin/Implementation/AdminTutorService';
import IAdminController from '../../controller/admin/IAdminController';
import IAdminTutorController from '../../controller/admin/IAdminTutorController';
import AdminDashboardRepository from '../../repository/admin/implementation/AdminDashboardRepository';
import AdminDashboardService from '../../service/admin/Implementation/AdminDashboardService';
import IAdminDashboardController from '../../controller/admin/IAdminDashboardController';
import AdminDashboardController from '../../controller/admin/implementation/AdminDashboardController';

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController: IAdminController = new AdminController(adminService);

const adminTutorRepository = new AdminTutorRepository()
const adminTutorService = new AdminTutorService(adminTutorRepository);
const adminTutorController: IAdminTutorController = new AdminTutorController(adminTutorService)

const adminDashboardRepository = new AdminDashboardRepository();
const adminDashboardService = new AdminDashboardService(adminDashboardRepository);
const adminDashboardController: IAdminDashboardController = new AdminDashboardController(adminDashboardService)



const router = Router();

router.post('/signin', adminController.signinPost.bind(adminController))
router.post('/logout', adminController.logout.bind(adminController));
router.post('/refresh-token', adminController.refreshToken.bind(adminController));

//students management
router.get('/getstudents', validateToken("admin"), adminController.getStudents.bind(adminController))
router.patch('/updatestudentstatus', validateToken("admin"), adminController.blockStudent.bind(adminController))

// tutor mangement
router.get('/gettutors', validateToken("admin"), adminController.getTutors.bind(adminController))
router.patch('/updatetutorstatus', validateToken("admin"), adminController.blockTutor.bind(adminController))

// tutor verificaton
router.get('/pending-tutor', validateToken("admin"), adminTutorController.getPendingTutors.bind(adminTutorController))
router.get('/get-tutor/:id', validateToken("admin"), adminTutorController.getTutor.bind(adminTutorController))
router.patch('/reject-tutor', validateToken("admin"), adminTutorController.rejectTutor.bind(adminTutorController))
router.patch('/approve-tutor', validateToken("admin"), adminTutorController.approveTutor.bind(adminTutorController))

// category management
router.post('/create-category', validateToken("admin"), adminTutorController.createCategory.bind(adminTutorController))
router.get('/categories', validateToken("admin"), adminTutorController.getCategories.bind(adminTutorController))
router.patch('/updatecategorystatus', validateToken("admin"), adminTutorController.blockCategory.bind(adminTutorController))
router.delete('/delete-category', validateToken("admin"), adminTutorController.deleteCategory.bind(adminTutorController))

//Course management
router.get('/pending-course', validateToken("admin"), adminTutorController.pendingCourse.bind(adminTutorController))
router.get("/get-categories", validateToken("admin"), adminTutorController.getCategory.bind(adminTutorController))
router.get('/course-details/:id', validateToken('admin'), adminTutorController.courseDetails.bind(adminTutorController))
router.get(`/get-categoryname/:id`, validateToken("admin"), adminTutorController.getCategoryName.bind(adminTutorController))
router.get('/sections/:id', validateToken('admin'), adminTutorController.getSections.bind(adminTutorController))
router.get('/lectures/:id', validateToken('admin'), adminTutorController.getLectures.bind(adminTutorController))

//Reject and approve course

router.patch('/reject-course/:id', validateToken('admin'), adminTutorController.rejectCourse.bind(adminTutorController))
router.patch('/approve-course/:id', validateToken('admin'), adminTutorController.approveCourse.bind(adminTutorController))

// Subscription 
router.get('/subscriptions', validateToken('admin'), adminTutorController.getSubscription.bind(adminTutorController))
router.post('/subscriptions', validateToken('admin'), adminTutorController.createSubscription.bind(adminTutorController))
router.patch('/subscriptions', validateToken('admin'), adminTutorController.editSubscription.bind(adminTutorController))
router.delete('/subscriptions/:id', validateToken('admin'), adminTutorController.deleteSubscription.bind(adminTutorController))

// Tutor earnigs
router.get('/tutor-wallets', validateToken("admin"), adminTutorController.getTutorsWalltes.bind(adminTutorController));
router.get('/gettutor-list', validateToken("admin"), adminTutorController.getTutorsList.bind(adminTutorController));

//Tutor Dashboard
router.get(`/get-dashboard-data`, validateToken('admin'), adminDashboardController.getDashboardData.bind(adminDashboardController));
router.get(`/wallet`, validateToken('admin'), adminDashboardController.getWallet.bind(adminDashboardController));
router.get('/getstudentsdata',validateToken('admin'),adminDashboardController.getStudents.bind(adminDashboardController));
router.get(`/category-income`,validateToken('admin'),adminDashboardController.getCategoryIncomeDistribution.bind(adminDashboardController));
router.get(`/admin-monlty-income`,validateToken('admin'),adminDashboardController.getAdminMonthlyIncome.bind(adminDashboardController))
router.get(`/admin-yearly-income`,validateToken('admin'),adminDashboardController.getAdminYearlyIncome.bind(adminDashboardController))

export default router