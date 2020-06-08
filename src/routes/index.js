import express from 'express';
import MainController from '../controllers/main'
import api from './api';

const router = express.Router();
router.get('/', MainController.home)
router.use('/api/v1', api);

export default router;