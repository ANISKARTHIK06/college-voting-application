const mongoose = require("mongoose");

const announcementRevisionSchema = new mongoose.Schema({
    announcementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Announcement",
        required: true,
    },
    action: {
        type: String,
        enum: ["Edit", "Archive"],
        required: true,
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    changes: {
        type: mongoose.Schema.Types.Mixed, // Store the before/after or just the previous state
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("AnnouncementRevision", announcementRevisionSchema);
