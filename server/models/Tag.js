import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    discussions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion'
    }],
    doubts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doubt'
    }],
})

tagSchema.index({ name: 1 });
export default mongoose.model('Tag', tagSchema);