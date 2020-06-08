import express from 'express';
import consultantController from '../../controllers/patients';
import UserController from '../../controllers/patient';
//import {Validation} from '../../middleware/validation';
import {verifyToken} from '../../helpers';


const router = express.Router();


router.post('/consultant',verifyToken ,consultantController.consultant );
router.get('/', verifyToken, UserController.getAllPatient);
router.patch('/:patient_id', verifyToken,UserController.editPatient);

export default router;