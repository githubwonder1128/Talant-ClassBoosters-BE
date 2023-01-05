import express from "express";
import { postUniversity, getUniversity, deleteUniversity } from '../controllers/university.js';

const router = express.Router();

router.post("/",postUniversity);
router.get("/", getUniversity);
router.delete("/:id",deleteUniversity)

export default router;