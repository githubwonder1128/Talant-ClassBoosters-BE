import University from '../modals/University.js';

export const postUniversity = async (req, res) => {
    try {
        const { name, country, city, state, id } = req.body;
        const query = { _id: id };
        const university_update = {
            name,
            country,
            city,
            state
        };
        let message = "";
        const isExist = await University.find({ name, country, city, state });
        if (isExist.length > 0) {
            message = "Already Exist";
            return res.json({ success: false, message});
        }
        if (!id) {
            message = "Successfully Uploaded";
            const newUniversity = new University(university_update);
            await newUniversity.save();
        }else{
            //update
            message = "Successfully Updated"
            await University.findOneAndUpdate(query, university_update);
        }
        res.json({ success: true, message })
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed" })
    }
}

export const getUniversity = async (req,res) => {
    try {
        const universities = await University.find({});
        res.json({ success: true, data: universities })
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

export const deleteUniversity = async (req, res) => {
    try {
        const { id } = req.params;
        let message = "Successfully Deleted";
        await University.deleteOne({ _id: id });
        return res.json({ success: true, message })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed" })
    }
}