import express from "express";
import { register, login, accessToken } from '../controllers/auth.js';

const router = express.Router();

router.post("/sign-up",register);
router.post("/sign-in", login);
router.post("/access-token", accessToken)

export default router;