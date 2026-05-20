import express from 'express';
import { register, login, logout, getProfile, changePassword } from '../controller/authController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', isAuthenticated, getProfile);
router.post('/change-password', isAuthenticated, changePassword);

export default router;
