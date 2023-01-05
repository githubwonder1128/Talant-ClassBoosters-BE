import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UniversitySchema = new Schema({
    name: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    }
})

export default mongoose.model("universitys", UniversitySchema);
