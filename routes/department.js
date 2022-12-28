import express from "express";
import { postDepartment, getDepartment } from '../controllers/department.js';

const router = express.Router();

router.post("/",postDepartment);
router.get("/", getDepartment);

export default router;