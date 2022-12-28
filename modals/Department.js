import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    title: {
        type: String
    }
})

export default mongoose.model("departments", DepartmentSchema);
