const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    manifesto: {
        type: String,
        required: true,
    },
    achievements: [String],
    promises: [String],
    image: {
        type: String,
    },
    voteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vote",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Candidate", candidateSchema);
