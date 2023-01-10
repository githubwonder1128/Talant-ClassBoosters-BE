import express from "express";
import { register, login, accessToken, updateUser } from '../controllers/auth.js';

const router = express.Router();

router.post("/sign-up",register);
router.post("/sign-in", login);
router.post("/access-token", accessToken)
router.post("/update", updateUser);

export default router;