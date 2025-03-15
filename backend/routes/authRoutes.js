import express from 'express';
// import * as authController from '../controllers/authController.js';
import { login, register, googleAuth } from '../controllers/authController.js';

const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.post('/google', googleAuth);

export default router; 