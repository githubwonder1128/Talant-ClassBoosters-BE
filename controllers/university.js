import mongoose from 'mongoose';
import Course from '../modals/Course.js';
import Department from '../modals/Department.js';
import University from '../modals/University.js';
import Document from '../modals/Document.js';

export const postUniversity = async (req, res) => {
    try {
        const { title, location } = req.body;
        const newUniversity = new University({ title, location });
        await newUniversity.save();
        res.json({ success: true })
    } catch (error) {
        res.json({ success: false })
    }
}

export const getUniversity = async (req,res) => {
    try {
        const universities = await University.find({});
        res.json({ success: true, data: universities })
    } catch (error) {
        res.json({ success: false });
    }
}