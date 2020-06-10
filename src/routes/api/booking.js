import express from 'express';
import consultantController from '../../controllers/patients';
//import {Validation} from '../../middleware/validation';
import {verifyToken} from '../../helpers';


const router = express.Router();


router.post('/:doctor_id',verifyToken ,consultantController.booking );
//router.get('/', verifyToken, UserController.getAllPatient);
//router.patch('/:patient_id', verifyToken,UserController.editPatient);

export default router;