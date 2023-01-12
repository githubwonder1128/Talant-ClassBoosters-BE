import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String
    },
    password: {
        type: String,
        default: "Customer"
    }
})

export default mongoose.model("users", UserSchema);