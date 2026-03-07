const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    votingType: {
        type: String,
        enum: ["Election", "Approval", "Ranked", "Weighted"],
        required: true,
    },
    candidates: [
        {
            name: String,
            description: String,
            image: String,
        },
    ],
    eligibleGroup: {
        type: String, // "All Users", "Department", "Year", "Club"
        required: true,
    },
    eligibleValues: [String], // e.g., ["CS", "IT"] if type is Department
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["draft", "active", "ended", "published"],
        default: "draft",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Vote", voteSchema);
