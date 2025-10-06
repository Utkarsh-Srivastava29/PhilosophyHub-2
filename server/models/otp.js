import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    validUntil: {
        type: Date,
        required: true
    },
    blockedUntil: {
        type: Date,
        default: null
    }
},{timestamps: true});

otpSchema.index({email: 1});

export default mongoose.model('Otp', otpSchema);