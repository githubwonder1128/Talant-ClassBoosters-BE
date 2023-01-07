import Department from '../modals/Department.js';

export const postDepartment = async (req, res) => {
    try {
        const { department, university, id } = req.body;
        const isExist = await Department.find({ university, department })
        if (isExist.length > 0) {
            return res.json({ success: false, message: "Already exist"});
        }
        if (id) {
            //edit
            await Department.findByIdAndUpdate(id, { department, university });
        }else{
            //insert
            const newDepartment = new Department({ department, university });
            await newDepartment.save();
        }
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