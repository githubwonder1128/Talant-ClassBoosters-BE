import express from "express";
import multer from 'multer';
import multerS3 from 'multer-s3';
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import { postDocument, getDocuments, readDocuments, deleteDocument } from '../controllers/document.js'

const s3 = new AWS.S3();


AWS.config.update({
    region: 'us-east-2',
    accessKeyId:  process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});


const DIR = './public/';
const router = express.Router();

router.post("/", postDocument);
router.get("/", getDocuments);
router.post("/read", readDocuments);
router.get("/test", (req, res) => res.json("This is Test"))
router.delete("/:id", deleteDocument)

export default router;