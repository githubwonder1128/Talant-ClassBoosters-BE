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
    course: {
        type: mongoose.Types.ObjectId,
        ref: "courses"
    },
    fileName: {
        type: String
    },
    preview: {
        type: String
    },
    extension: {
        type: String
    }
})

export default mongoose.model("documents", DocumentSchema);
