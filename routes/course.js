import express from "express";
import { postCourse, getCourse, deletedCourse } from '../controllers/course.js';

const router = express.Router();

router.post("/",postCourse);
router.get("/", getCourse);
router.delete("/:id",deletedCourse);

export default router;