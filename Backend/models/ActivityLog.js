const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    details: {
        type: String,
    },
    ipAddress: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
