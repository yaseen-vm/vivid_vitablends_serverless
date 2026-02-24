import express from 'express';
import * as messageController from '../controllers/message.controller.js';

const router = express.Router();

router.post('/', messageController.create);
router.get('/', messageController.getAll);

export default router;
