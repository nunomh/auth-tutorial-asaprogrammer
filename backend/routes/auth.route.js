import express from 'express';
import { login, logout, signup, verifyEmail, deleteUserByEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get("/check-auth", verifyToken, checkAuth);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/deleteUserByEmail", deleteUserByEmail); // for testing

export default router;