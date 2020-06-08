import express from 'express';
import DoctorController from '../../controllers/doctor';
//import {Validation} from '../../middleware/validation';
import {verifyToken} from '../../helpers';


const router = express.Router();

//router.post('/signup', Validation.userValidator,UserController.registerUser);
router.post('/signup',DoctorController.registerUser);
router.post('/filter', DoctorController.getSpecificDoctors);
router.post('/login', DoctorController.login);
//router.patch('/admin/:user_id/',verifyToken,isAdmin, makeUserAdmin );

export default router;