import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UniversitySchema = new Schema({
    title: {
        type: String
    },
    location: {
        type: String
    }
})

export default mongoose.model("universitys", UniversitySchema);
