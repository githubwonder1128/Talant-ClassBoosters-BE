import express from "express";
import { postDepartment, getDepartment, deleteDepartment } from '../controllers/department.js';

const router = express.Router();

router.post("/",postDepartment);
router.get("/", getDepartment);
router.delete("/:id",deleteDepartment);

export default router;