import Course from '../modals/Course.js';
import AWS from 'aws-sdk';
import moment from "moment";
import University from '../modals/University.js';
import Department from '../modals/Department.js';

const s3 = new AWS.S3({
    region: "us-east-2",
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY
});

export const postCourse = async (req, res) => {
    try {
        const { name, code, description, level, department, university,status, id } = req.body;
        let message = "";
        let isExist = [];
        if (!id) {
            isExist = await Course.find({ name, code, description, level, department, university });
        }else{
            isExist = await Course.find({ name, code, description, level, department, university , _id : { $ne: id }});
        }
       
        const updated = { 
            name, 
            code, 
            description, 
            level, 
            department, 
            university,
            status,
            upload_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss") 
        }

        if (isExist.length > 0) {
            return res.json({ success: false, message: "Already exist"});
        }
        if (id) {
            //edit
            message = "You have successfuly updated a course.";
            await Course.findByIdAndUpdate(id, updated);
           
        }else{
            //insert
            console.log(updated);
            message = "You have successfuly added a course.";
            const newCourse = new Course({...updated, folder_name: name});
            const { _id } = await newCourse.save();

            const tUniversity = await University.findById(university);
            const tDepartment = await Department.findById(department);
            s3.putObject({
                Key: `${tUniversity.folder_name}-${university}/${tDepartment.folder_name}-${department}/${name}-${_id}/`, // This should create an empty object in which we can store files 
                Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
            }).promise();
        }
        
        res.json({ success: true,  message })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Failed" });
    }
}

export const getCourse = async (req,res) => {
    try {
        const courses = await Course.find({}).sort({ upload_date: -1});
        res.json({ success: true, data: courses })
    } catch (error) {
        res.json({ success: false });
    }
}

export const deletedCourse = async (req, res) => {
    try {
        const { id } = req.params;
        let message = "You have successfuly deleted a course.";
        await Course.deleteOne({ _id: id });
        return res.json({ success: true, message })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed" })
    }
}