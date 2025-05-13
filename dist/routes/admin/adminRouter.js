"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminRepository_1 = __importDefault(require("../../repository/admin/implementation/AdminRepository"));
const AdminService_1 = __importDefault(require("../../service/admin/Implementation/AdminService"));
const AdminController_1 = __importDefault(require("../../controller/admin/implementation/AdminController"));
const validateToken_1 = require("../../middleware/validateToken");
const AdminTutorController_1 = __importDefault(require("../../controller/admin/implementation/AdminTutorController"));
const AdminTutorRepository_1 = __importDefault(require("../../repository/admin/implementation/AdminTutorRepository"));
const AdminTutorService_1 = __importDefault(require("../../service/admin/Implementation/AdminTutorService"));
const AdminDashboardRepository_1 = __importDefault(require("../../repository/admin/implementation/AdminDashboardRepository"));
const AdminDashboardService_1 = __importDefault(require("../../service/admin/Implementation/AdminDashboardService"));
const AdminDashboardController_1 = __importDefault(require("../../controller/admin/implementation/AdminDashboardController"));
const adminRepository = new AdminRepository_1.default();
const adminService = new AdminService_1.default(adminRepository);
const adminController = new AdminController_1.default(adminService);
const adminTutorRepository = new AdminTutorRepository_1.default();
const adminTutorService = new AdminTutorService_1.default(adminTutorRepository);
const adminTutorController = new AdminTutorController_1.default(adminTutorService);
const adminDashboardRepository = new AdminDashboardRepository_1.default();
const adminDashboardService = new AdminDashboardService_1.default(adminDashboardRepository);
const adminDashboardController = new AdminDashboardController_1.default(adminDashboardService);
const router = (0, express_1.default)();
router.post('/signin', adminController.signinPost.bind(adminController));
router.post('/logout', adminController.logout.bind(adminController));
router.post('/refresh-token', adminController.refreshToken.bind(adminController));
//students management
router.get('/getstudents', (0, validateToken_1.validateToken)("admin"), adminController.getStudents.bind(adminController));
router.patch('/updatestudentstatus', (0, validateToken_1.validateToken)("admin"), adminController.blockStudent.bind(adminController));
// tutor mangement
router.get('/gettutors', (0, validateToken_1.validateToken)("admin"), adminController.getTutors.bind(adminController));
router.patch('/updatetutorstatus', (0, validateToken_1.validateToken)("admin"), adminController.blockTutor.bind(adminController));
// tutor verificaton
router.get('/pending-tutor', (0, validateToken_1.validateToken)("admin"), adminTutorController.getPendingTutors.bind(adminTutorController));
router.get('/get-tutor/:id', (0, validateToken_1.validateToken)("admin"), adminTutorController.getTutor.bind(adminTutorController));
router.patch('/reject-tutor', (0, validateToken_1.validateToken)("admin"), adminTutorController.rejectTutor.bind(adminTutorController));
router.patch('/approve-tutor', (0, validateToken_1.validateToken)("admin"), adminTutorController.approveTutor.bind(adminTutorController));
// category management
router.post('/create-category', (0, validateToken_1.validateToken)("admin"), adminTutorController.createCategory.bind(adminTutorController));
router.get('/categories', (0, validateToken_1.validateToken)("admin"), adminTutorController.getCategories.bind(adminTutorController));
router.patch('/updatecategorystatus', (0, validateToken_1.validateToken)("admin"), adminTutorController.blockCategory.bind(adminTutorController));
router.delete('/delete-category', (0, validateToken_1.validateToken)("admin"), adminTutorController.deleteCategory.bind(adminTutorController));
//Course management
router.get('/pending-course', (0, validateToken_1.validateToken)("admin"), adminTutorController.pendingCourse.bind(adminTutorController));
router.get("/get-categories", (0, validateToken_1.validateToken)("admin"), adminTutorController.getCategory.bind(adminTutorController));
router.get('/course-details/:id', (0, validateToken_1.validateToken)('admin'), adminTutorController.courseDetails.bind(adminTutorController));
router.get(`/get-categoryname/:id`, (0, validateToken_1.validateToken)("admin"), adminTutorController.getCategoryName.bind(adminTutorController));
router.get('/sections/:id', (0, validateToken_1.validateToken)('admin'), adminTutorController.getSections.bind(adminTutorController));
router.get('/lectures/:id', (0, validateToken_1.validateToken)('admin'), adminTutorController.getLectures.bind(adminTutorController));
//Reject and approve course
router.patch('/reject-course/:id', (0, validateToken_1.validateToken)('admin'), adminTutorController.rejectCourse.bind(adminTutorController));
router.patch('/approve-course/:id', (0, validateToken_1.validateToken)('admin'), adminTutorController.approveCourse.bind(adminTutorController));
// Subscription 
router.get('/subscriptions', (0, validateToken_1.validateToken)('admin'), adminTutorController.getSubscription.bind(adminTutorController));
router.post('/subscriptions', (0, validateToken_1.validateToken)('admin'), adminTutorController.createSubscription.bind(adminTutorController));
router.patch('/subscriptions', (0, validateToken_1.validateToken)('admin'), adminTutorController.editSubscription.bind(adminTutorController));
router.delete('/subscriptions/:id', (0, validateToken_1.validateToken)('admin'), adminTutorController.deleteSubscription.bind(adminTutorController));
// Tutor earnigs
router.get('/tutor-wallets', (0, validateToken_1.validateToken)("admin"), adminTutorController.getTutorsWalltes.bind(adminTutorController));
router.get('/gettutor-list', (0, validateToken_1.validateToken)("admin"), adminTutorController.getTutorsList.bind(adminTutorController));
//Tutor Dashboard
router.get(`/get-dashboard-data`, (0, validateToken_1.validateToken)('admin'), adminDashboardController.getDashboardData.bind(adminDashboardController));
router.get(`/wallet`, (0, validateToken_1.validateToken)('admin'), adminDashboardController.getWallet.bind(adminDashboardController));
router.get('/getstudentsdata', (0, validateToken_1.validateToken)('admin'), adminDashboardController.getStudents.bind(adminDashboardController));
router.get(`/category-income`, (0, validateToken_1.validateToken)('admin'), adminDashboardController.getCategoryIncomeDistribution.bind(adminDashboardController));
router.get(`/admin-monlty-income`, (0, validateToken_1.validateToken)('admin'), adminDashboardController.getAdminMonthlyIncome.bind(adminDashboardController));
router.get(`/admin-yearly-income`, (0, validateToken_1.validateToken)('admin'), adminDashboardController.getAdminYearlyIncome.bind(adminDashboardController));
router.get(`/admin-income-by-date-range`, (0, validateToken_1.validateToken)('admin'), adminDashboardController.getAdminIncomeByDateRange.bind(adminDashboardController));
exports.default = router;
