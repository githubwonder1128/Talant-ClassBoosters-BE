import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
        type: String
    },
    code: {
        type: String
    },
    description: {
        type: String
    },
    level: {
        type: String
    },
    department: {
        type: mongoose.Types.ObjectId,
        ref: "departments"
    },
    university: {
        type: mongoose.Types.ObjectId,
        ref: "universitys"
    }

})

export default mongoose.model("course", CourseSchema);
