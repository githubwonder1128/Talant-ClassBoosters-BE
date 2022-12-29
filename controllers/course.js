import Course from '../modals/Course.js';

export const postCourse = async (req, res) => {
    try {
        const { name, title, description, level, updated, department, university, uploaderName } = req.body;
        const newCourse = new Course({ name, title, description, level, updated, department, university, uploaderName });
        await newCourse.save();
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
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