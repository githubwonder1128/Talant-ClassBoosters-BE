import express from "express";
import { postDepartment, getDepartment, deleteDepartment, getRecentDepartment } from '../controllers/department.js';

const router = express.Router();

router.post("/",postDepartment);
router.get("/", getDepartment);
router.get("/recent", getRecentDepartment);
router.delete("/:id",deleteDepartment);

export default router;