import Router from 'express';
import AdminRepository from '../../repository/admin/implementation/AdminRepository';
import AdminService from '../../service/admin/Implementation/AdminService';
import AdminController from '../../controller/admin/adminController';
import { validateToken } from '../../middleware/validateToken';
import AdminTutorController from '../../controller/admin/tutorController';
import AdminTutorRepository from '../../repository/admin/implementation/AdminTutorRepository'
import AdminTutorService from '../../service/admin/Implementation/AdminTutorService';

const adminRepository = new AdminRepository();
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

const adminTutorRepository = new AdminTutorRepository()
const adminTutorService = new AdminTutorService(adminTutorRepository);
const adminTutorController = new AdminTutorController(adminTutorService)



const router = Router();

router.post('/signin',adminController.signinPost.bind(adminController))
router.post('/logout', adminController.logout.bind(adminController));
router.post('/refresh-token',adminController.refreshToken.bind(adminController));

//students management
router.get('/getstudents',validateToken("admin"),adminController.getStudents.bind(adminController))
router.patch('/updatestudentstatus',validateToken("admin"),adminController.blockStudent.bind(adminController))

// tutor mangement
router.get('/gettutors',validateToken("admin"),adminController.getTutors.bind(adminController))
router.patch('/updatetutorstatus',validateToken("admin"),adminController.blockTutor.bind(adminController))

// tutor verificaton
router.get('/pending-tutor',validateToken("admin"),adminTutorController.getPendingTutors.bind(adminTutorController))
router.get('/get-tutor/:id',validateToken("admin"),adminTutorController.getTutor.bind(adminTutorController))
router.patch('/reject-tutor',validateToken("admin"),adminTutorController.rejectTutor.bind(adminTutorController))
router.patch('/approve-tutor',validateToken("admin"),adminTutorController.approveTutor.bind(adminTutorController))

export default router