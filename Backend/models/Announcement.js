const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a title"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
    },
    department: {
        type: String, // Legacy, kept for backward compatibility
        default: "All",
    },
    targetType: {
        type: String,
        enum: ["Global", "Role", "Department", "Organization"],
        default: "Global",
    },
    targetValues: {
        type: [String],
        default: [],
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    priority: {
        type: String,
        enum: ["Normal", "Important"],
        default: "Normal",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Announcement", announcementSchema);
