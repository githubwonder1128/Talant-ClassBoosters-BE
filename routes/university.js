import express from "express";
import { postUniversity, getUniversity } from '../controllers/university.js';

const router = express.Router();

router.post("/",postUniversity);
router.get("/", getUniversity);

export default router;