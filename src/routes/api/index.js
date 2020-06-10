import express from 'express';
import user from './user';
import doctor from './doctor';
import patient from './patient';
import book from './booking';




const router = express.Router();

router.use('/auth', user);
router.use('/auth', doctor);
router.use('/doctor', doctor);
router.use('/patient', patient);
router.use('/booking', book);



export default router;
