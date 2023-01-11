import Department from '../modals/Department.js';
import AWS from 'aws-sdk';
import moment from "moment";
import University from '../modals/University.js';

const s3 = new AWS.S3();

AWS.config.loadFromPath("aws.json");

export const postDepartment = async (req, res) => {
    try {
        const { department, university, id } = req.body;
        const isExist = await Department.find({ university, department });
        let message = "";
        const updated = { 
            department, 
            university, 
            upload_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss") 
        }
        if (isExist.length > 0) {
            return res.json({ success: false, message: "Already exist"});
        }
        if (id) {
            //edit
            await Department.findByIdAndUpdate(id, updated);
            message = "Successfully updated";
        }else{
            //insert
            const newDepartment = new Department({...updated, folder_name: department});
            const { _id } = await newDepartment.save();
            message = "Successfully uploaded";
            const { folder_name } = await University.findById(university)
            await s3.putObject({
                Key: `${folder_name}-${university}/${department}-${_id}/`, // This should create an empty object in which we can store files 
                Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
            }).promise()
        }
        res.json({ success: true, message })
    } catch (error) {
        res.json({ success: false, message : "Failed" })
    }
}

export const getDepartment = async (req,res) => {
    try {
        const departments = await Department.find({}).sort({ upload_date: -1});
        res.json({ success: true, data: departments })
    } catch (error) {
        res.json({ success: false });
    }
}

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        let message = "Successfully Deleted";
        await Department.deleteOne({ _id: id });
        return res.json({ success: true, message })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed" })
    }
}