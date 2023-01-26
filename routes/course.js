import express from "express";
import { postCourse, getCourse, deletedCourse, getRecentCourse } from '../controllers/course.js';

const router = express.Router();

router.post("/",postCourse);
router.get("/", getCourse);
router.get("/recent",getRecentCourse);
router.delete("/:id",deletedCourse);

export default router;