import express from "express";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { postDocument, getDocuments, readDocuments } from '../controllers/document.js'

const DIR = './public/';
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        cb(null, true);
    }
});


router.post("/", upload.array('files[]'),postDocument);
router.get("/", getDocuments);
router.post("/read",readDocuments);
router.get("/test", (req,res) => res.json("This is Test"))

export default router;