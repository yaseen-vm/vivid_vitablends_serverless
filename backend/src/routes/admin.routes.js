import express from 'express';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', adminController.login);
router.post('/refresh', adminController.refresh);
router.post('/logout', adminController.logout);

export default router;
