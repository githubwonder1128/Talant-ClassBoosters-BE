
import Course from '../modals/Course.js';
import Document from '../modals/Document.js';
import AWS from 'aws-sdk';
import moment from "moment";
import University from '../modals/University.js';
import Department from "../modals/Department.js";

const s3 = new AWS.S3();

AWS.config.loadFromPath("aws.json");

// actual function for uploading file
async function uploadFile(file, key) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME, // bucket you want to upload to
      Key: key, // put all image to fileupload folder with name scanskill-${Date.now()}${file.name}`
      Body: file.data,
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
            await Document.findByIdAndUpdate( id, { name, amount, type, approved, upload_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss") });
            message = "Successfully Updated";
        }else{
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
                const key = `${t_university.folder_name}-${university}/${t_department.folder_name}-${department}/${t_course.folder_name}-${course}/${name}-${_id}.pdf`;
                const fileName = `${name}-${_id}.pdf`;
                if (newDocuments.length == 1) {
                    await uploadFile(files, key);
                }else{
                    await uploadFile(files[i], key);
                }
            }
            message = "Successfully Uploaded";
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
        const result = await Document.find({}).sort({"upload_date": -1});
        res.json({ success: true, data: result });
    } catch (error) {

    }
}

export const readDocuments = async (req, res) => {
    try {
        const { id } = req.body;
        const document = await Document.findById(id);
        const { extension, fileName, course } = document;

        const courseItem = await Course.findById(course).populate(['name','department','university']);
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
        let message = "Successfully Deleted";
        const { university, department, course, fileName } = await Document.findOneAndDelete({ _id: id });
        // Delete Doc in s3
        await s3.deleteObject({ 
            Bucket: process.env.AWS_S3_BUCKET_NAME, 
            Key:  `${university}-university/${department}-department/${course}-course/${fileName}`
        }).promise();
        return res.json({ success: true, message })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed" })
    }
}
