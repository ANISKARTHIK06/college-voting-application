const Announcement = require("../models/Announcement");
const AnnouncementRevision = require("../models/AnnouncementRevision");
const Notification = require("../models/Notification");
const User = require("../models/User");

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
    try {
        const query = {};
        if (req.query.isArchived === 'true') {
            query.isArchived = true;
        } else {
            query.isArchived = { $ne: true };
        }
        
        // Advanced Filtering
        if (req.query.targetType) {
            query.targetType = req.query.targetType;
        }
        
        const announcements = await Announcement.find(query)
            .populate("createdBy", "name")
            .sort("-publishDate");
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.create({
            ...req.body,
            createdBy: req.user.id,
        });

        // Trigger Notifications for all users
        const users = await User.find({ _id: { $ne: req.user.id } });
        const notifications = users.map(u => ({
            userId: u._id,
            title: "📢 New Announcement",
            description: `Admin published: "${announcement.title}". Read the full details in the announcements tab.`,
            type: 'announcement'
        }));
        await Notification.insertMany(notifications);

        res.status(201).json(announcement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
exports.updateAnnouncement = async (req, res) => {
    try {
        let announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        
        // Log Revision
        await AnnouncementRevision.create({
            announcementId: announcement._id,
            action: "Edit",
            changedBy: req.user.id,
            changes: req.body,
        });

        announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(announcement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: "Announcement not found" });
        }
        
        // Soft delete
        announcement.isArchived = true;
        await announcement.save();

        // Log Revision
        await AnnouncementRevision.create({
            announcementId: announcement._id,
            action: "Archive",
            changedBy: req.user.id,
            changes: { isArchived: true },
        });

        res.status(200).json({ message: "Announcement removed" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get announcement revisions
// @route   GET /api/announcements/:id/revisions
// @access  Private/Admin
exports.getAnnouncementRevisions = async (req, res) => {
    try {
        const revisions = await AnnouncementRevision.find({ announcementId: req.params.id })
            .populate("changedBy", "name email role")
            .sort("-timestamp");
        res.status(200).json(revisions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
