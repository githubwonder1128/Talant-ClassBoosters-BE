import express from "express";
import { postCourse, getCourse } from '../controllers/course.js';

const router = express.Router();

router.post("/",postCourse);
router.get("/", getCourse);

export default router;