
import Course from '../modals/Course.js';
import Document from '../modals/Document.js';
import AWS from 'aws-sdk';
import pdfjsLib from "pdfjs-dist";
import moment from "moment";
import { join } from "path";
import fs from "fs";
import NodeCanvasFactory from "../nodeCanva.js";
import University from '../modals/University.js';
import Department from "../modals/Department.js";


const s3 = new AWS.S3({
    region: "us-east-2",
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY
});

// actual function for uploading file
async function uploadFile(file, key) {
    const rawData = new Uint8Array(file.data)

    const loadingTask = pdfjsLib.getDocument(rawData)
    loadingTask.promise
        .then(function (pdfDocument) {
            console.log('# PDF document loaded.')

            // Get the first page.
            pdfDocument.getPage(1).then(function (page) {

                // Render the page on a Node canvas with 100% scale.
                const viewport = page.getViewport({ scale: 1.0 })
                const canvasFactory = new NodeCanvasFactory()
                const canvasAndContext = canvasFactory.create(viewport.width, viewport.height)
                const renderContext = {
                    canvasContext: canvasAndContext.context,
                    viewport: viewport,
                    canvasFactory: canvasFactory,
                }

                const renderTask = page.render(renderContext)
                renderTask.promise.then(async function () {
                    // Convert the canvas to an image buffer.
                    const image = canvasAndContext.canvas.toBuffer()
                    const thumbParam = {
                        Bucket: process.env.AWS_S3_BUCKET_NAME, // bucket you want to upload to
                        Key: `${key}.png`, // put all image to fileupload folder with name scanskill-${Date.now()}${file.name}`
                        Body: image,
                        ContentType: "image/png"
                    };

                    const data = await s3.upload(thumbParam).promise();
                })
            })
        })
        .catch(function (reason) {
            // console.log(reason)
        })

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME, // bucket you want to upload to
        Key: `${key}.pdf`, // put all image to fileupload folder with name scanskill-${Date.now()}${file.name}`
        Body: file.data,
        ContentType: "application/pdf"
    };
    const data = await s3.upload(params).promise();
    return data.Location; // returns the url location
}

export const postDocument = async (req, res) => {
    try {

        const { selected, document, id } = req.body;
        let message = "";
        if (id) {
            //edit
            const { name, amount, type, approved } = JSON.parse(document);
            await Document.findByIdAndUpdate(id, { name, amount, type, approved, upload_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss") });
            message = "You have successfuly updated a document.";
        } else {
            const files = req.files.files;
            //insert
            const newSource = JSON.parse(selected);
            const newDocuments = JSON.parse(document);

            for (let i = 0; i < newDocuments.length; i++) {
                const { name, amount, type, approved } = newDocuments[i];
                const { university, department, course } = newSource;

                const t_university = await University.findById(university);
                const t_department = await Department.findById(department);
                const t_course = await Course.findById(course);


                const newDocument = new Document({ name, amount, type, approved, university, department, course, fileName: name, upload_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss") });
                const { _id } = await newDocument.save();
                const key = `${t_university.folder_name}-${university}/${t_department.folder_name}-${department}/${t_course.folder_name}-${course}/${name}-${_id}`;
                const fileName = `${name}-${_id}.pdf`;
                if (newDocuments.length == 1) {
                    await uploadFile(files, key);
                } else {
                    await uploadFile(files[i], key);
                }
            }
            message = "You have successfuly added a document.";
        }
        // the file when inserted from form-data comes in req.files.file


        // returning fileupload location
        return res.json({ success: true, message });
        // res.json({ success: true, message: "Successfully Uploaded" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed" });

    }
}

export const getDocuments = async (req, res) => {
    try {
        const result = await Document.find({}).populate(['university', 'department', 'course']).sort({ "upload_date": -1 });
        const total = [];
        for (let i = 0; i < result.length; i++) {
            const record = result[i];
            const universityId = record.university._id;
            const universityName = record.university.folder_name;
            const departmentId = record.department._id;
            const departmentName = record.department.folder_name;
            if (!record.course) continue;
            const courseId = record.course._id;
            const courseName = record.course.folder_name;
            const documentName = record.fileName;
            const documentId = record._id;
            const key = `${universityName}-${universityId}/${departmentName}-${departmentId}/${courseName}-${courseId}/${documentName}-${documentId}`;

            const params = {
                Key: `${key}.pdf`,
                Bucket: process.env.AWS_S3_BUCKET_NAME
            }
            const url = await s3.getSignedUrlPromise("getObject", params); // pdf

            const thumb = {
                Key: `${key}.png`,
                Bucket: process.env.AWS_S3_BUCKET_NAME
            }

            const thumbnail = await s3.getSignedUrlPromise("getObject", thumb); // thumb
            // const url = await s3.getObject(params).promise();
            // let objectURL = URL.createObjectURL(blob);
            total.push({
                _id: record._id,
                name: record.name,
                amount: record.amount,
                type: record.type,
                approved: record.approved,
                university: record.university,
                department: record.department,
                course: record.course,
                fileName: record.fileName,
                upload_date: record.upload_date,
                url,
                thumbnail
            })

        }
        res.json({ success: true, data: total });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
}

export const readDocuments = async (req, res) => {
    try {
        const { id } = req.body;
        const document = await Document.findById(id);
        const { extension, fileName, course } = document;

        const courseItem = await Course.findById(course).populate(['name', 'department', 'university']);
        const courseName = courseItem.name;
        const universityName = courseItem.university.title;
        const departmentName = courseItem.department.title;


        res.json({ data: fileName, extension, courseName, departmentName, universityName })
    } catch (error) {
        console.log(error);
    }
}

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;;
        let message = "You have successfuly deleted a document.";
        const { university, department, course, fileName } = await Document.findOneAndDelete({ _id: id }).populate(['university',"department",'course']);
        // Delete Doc in s3
        await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${university.folder_name}-${university._id}/${department.folder_name}-${department._id}/${course.folder_name}-${course._id}/${fileName}-${id}.pdf`
        }).promise();
        await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${university.folder_name}-${university._id}/${department.folder_name}-${department._id}/${course.folder_name}-${course._id}/${fileName}-${id}.png`
        }).promise();
        return res.json({ success: true, message })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed" })
    }
}

export const getRecentDocument = async (req, res) => {
    try {
        const recent = await Document.find({}).populate(['university', 'department', 'course']).sort({ "upload_date": -1 }).slice(0, 6);
        res.json({ success: true, data: recent })
    } catch (error) {
        res.status(500).json({ success: false })
    }
}