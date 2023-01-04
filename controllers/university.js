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
        const options = { upsert: true, new: true, setDefaultsOnInsert: true, useFindAndModify: false };
        await University.findOneAndUpdate(query, university_update, options);
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ success: false })
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
        console.log(id);
        await University.deleteOne({ _id: id });
        return res.json({ success: true })
    } catch (error) {
        return res.status(500).json({ success: false })
    }
}