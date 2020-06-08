import express from 'express';
import MtController from '../../controllers/payment';
//import {Validation} from '../../middleware/validation';
import {verifyToken} from '../../helpers';


const router = express.Router();


router.post('/consultant',verifyToken ,consultantController.consultant );

export default router;