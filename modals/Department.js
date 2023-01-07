import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    university:{
        type: mongoose.Types.ObjectId,
        ref: "universitys"
    },
    department: {
        type: String
    }
})

export default mongoose.model("departments", DepartmentSchema);
