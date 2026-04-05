const mongoose = require("mongoose");

const votesCastSchema = new mongoose.Schema({
    voteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vote",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    candidateId: {
        type: String, // Or ObjectId if we want to ref candidates specifically
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

// Ensure a user can only vote once per voting event
votesCastSchema.index({ voteId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("VotesCast", votesCastSchema);
