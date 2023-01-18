
import University from '../modals/University.js';
import AWS from 'aws-sdk';
import moment from "moment";

const s3 = new AWS.S3({
    region: "us-east-2",
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_ACCESS_KEY
});


export const postUniversity = async (req, res) => {
    try {
        const { name, country, city, state, id } = req.body;
        const query = { _id: id };
        const university_update = {
            name,
            country,
            city,
            state,
            upload_date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        };
        let message = "";

        let isExist = [];
        if (!id) {
            isExist = await University.find({ name, country, city, state });
        }else{
            isExist = await University.find({ name, country, city, state, _id : { $ne: id } });
        }
        if (isExist.length > 0) {
            message = "Already Exist";
            return res.json({ success: false, message});
        }
        if (!id) {
            
            message = "You have successfuly added a university.";
            const newUniversity = new University({...university_update, folder_name: name});
            const { _id } = await newUniversity.save();
        
            await s3.putObject({
                Key: `${name}-${_id}/`, // This should create an empty object in which we can store files 
                Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
            }).promise();
        }else{
            //update
            message = "You have successfuly updated a university."
            await University.findOneAndUpdate(query, university_update);
        }
        res.json({ success: true, message })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Failed" })
    }
}

export const getUniversity = async (req,res) => {
    try {
        const universities = await University.find({}).sort({ upload_date : -1});
        res.json({ success: true, data: universities })
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

export const deleteUniversity = async (req, res) => {
    try {
        const { id } = req.params;
        let message = "You have successfuly deleted a university.";
        const { name } = await University.findOneAndDelete({ _id: id });
        return res.json({ success: true, message });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed" });
    }
}