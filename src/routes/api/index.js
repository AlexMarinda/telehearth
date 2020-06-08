import express from 'express';
import user from './user';
import doctor from './doctor';
import patient from './patient';




const router = express.Router();

router.use('/auth', user);
router.use('/auth', doctor);
router.use('/doctor', doctor);
router.use('/patient', patient);



export default router;
