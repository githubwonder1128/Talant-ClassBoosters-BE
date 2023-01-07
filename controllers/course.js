import Course from '../modals/Course.js';

export const postCourse = async (req, res) => {
    try {
        const { name, code, description, level, department, university, id } = req.body;
        let message = "";
        const isExist = await Course.find({ name, code, description, level, department, university });
        if (isExist.length > 0) {
            return res.json({ success: false, message: "Already exist"});
        }
        if (id) {
            //edit
            message = "Successfully Updated";
            await Course.findByIdAndUpdate(id, { name, code, description, level, department })
        }else{
            //insert
            message = "Successfully Uploaded";
            const newCourse = new Course({ name, code, description, level, department, university });
            await newCourse.save();
        }
        
        res.json({ success: true,  message })
    } catch (error) {
        res.json({ success: false, message: "Failed" });
    }
}

export const getCourse = async (req,res) => {
    try {
        const courses = await Course.find({});
        res.json({ success: true, data: courses })
    } catch (error) {
        res.json({ success: false });
    }
}

export const deletedCourse = async (req, res) => {
    try {
        const { id } = req.params;
        let message = "Successfully Deleted";
        await Course.deleteOne({ _id: id });
        return res.json({ success: true, message })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed" })
    }
}