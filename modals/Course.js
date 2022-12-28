import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    level: {
        type: String
    },
    updated: {
        type: Date,
        default: Date.now()
    },
    department: {
        type: mongoose.Types.ObjectId,
        ref: "departments"
    },
    university: {
        type: mongoose.Types.ObjectId,
        ref: "universitys"
    },
    uploaderName: {
        type: String
    }

})

export default mongoose.model("course", CourseSchema);
