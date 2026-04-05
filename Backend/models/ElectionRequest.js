const mongoose = require('mongoose');

const electionRequestSchema = new mongoose.Schema({
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    votingType: {
        type: String,
        enum: ['Election', 'Approval', 'Ranked', 'Weighted'],
        required: true,
    },
    eligibleGroup: { type: String, required: true },
    eligibleValues: [String],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    candidates: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String,
            registerNumber: String,
            description: String,
        }
    ],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ElectionRequest', electionRequestSchema);
