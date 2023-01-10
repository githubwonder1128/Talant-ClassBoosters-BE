import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    name: {
        type: String
    },
    amount: {
        type: Number
    },
    type: {
        type: String
    },
    approved: {
        type: Boolean
    },
    university: {
        type: mongoose.Types.ObjectId,
        ref: "universitys"
    },
    department:{
        type: mongoose.Types.ObjectId,
        ref: "departments"
    },
    course: {
        type: mongoose.Types.ObjectId,
        ref: "courses"
    },
    fileName: {
        type: String
    },
    extension: {
        type: String
    },
    upload_date: {
        type: Date,
        default: Date.now()
    },
})

export default mongoose.model("documents", DocumentSchema);
