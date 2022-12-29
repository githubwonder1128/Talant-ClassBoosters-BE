import Department from '../modals/Department.js';

export const postDepartment = async (req, res) => {
    try {
        const { title } = req.body;
        const newDepartment = new Department({ title });
        await newDepartment.save();
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
    }
}

export const getDepartment = async (req,res) => {
    try {
        const departments = await Department.find({});
        res.json({ success: true, data: departments })
    } catch (error) {
        res.json({ success: false });
    }
}