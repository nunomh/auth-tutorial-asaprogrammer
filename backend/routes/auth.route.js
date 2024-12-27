import express from 'express';
import { login, logout, signup, verifyEmail, deleteUserByEmail, forgotPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/deleteUserByEmail", deleteUserByEmail); // for testing

export default router;