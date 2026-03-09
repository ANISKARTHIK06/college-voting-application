const ActivityLog = require("../models/ActivityLog");

// @desc    Get all activity logs
// @route   GET /api/activity
// @access  Private/Admin
exports.getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate("user", "name email role")
            .sort("-timestamp")
            .limit(100);
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to log activity
exports.logAction = async (userId, action, details = "", ip = "") => {
    try {
        await ActivityLog.create({
            user: userId,
            action,
            details,
            ipAddress: ip,
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};
