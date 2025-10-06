import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    doubt: {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Doubt',
        required: true
    },
    response: {
        type: String,
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isAccepted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


export default mongoose.model('Response', responseSchema);