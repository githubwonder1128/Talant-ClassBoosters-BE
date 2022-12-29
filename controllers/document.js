
import Course from '../modals/Course.js';
import Document from '../modals/Document.js';


export const postDocument = async (req, res) => {
    try {
        const reqFiles = [];
        const exts = [];
        const url = req.protocol + '://' + req.get('host');

        for (var i = 0; i < req.files.length; i++) {
            reqFiles.push(url+'/public/' + req.files[i].filename);
            const subs = req.files[i].filename.split(".");
            exts.push(subs[subs.length - 1]);
        }
        const { document, course } = req.body;
        const newDatas = JSON.parse(document);
        for (let i = 0; i < newDatas.length; i++) {
            const { name, amount, type, approved } = newDatas[i]
            const newDocument = new Document({
                name,
                amount,
                type,
                approved,
                fileName: reqFiles[i],
                extension: exts[i],
                course
            });
            await newDocument.save();
        }
        res.json({ success: true });
    } catch (error) {

    }
}

export const getDocuments = async (req, res) => {
    try {
        const result = await Document.find({});
        res.json({ success: true, data: result });
    } catch (error) {

    }
}

export const readDocuments = async (req, res) => {
    try {
        const { id } = req.body;
        const document = await Document.findById(id);
        const { extension, fileName, course } = document;

        const courseItem = await Course.findById(course).populate(['name','department','university']);
        const courseName = courseItem.name;
        const universityName = courseItem.university.title;
        const departmentName = courseItem.department.title;


        res.json({ data: fileName, extension, courseName, departmentName, universityName })
    } catch (error) {
        console.log(error);
    }
}
