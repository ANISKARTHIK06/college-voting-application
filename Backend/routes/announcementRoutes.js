const express = require("express");
const router = express.Router();
const {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getAnnouncementRevisions,
} = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");
const logMiddleware = require("../middleware/logMiddleware");

router.get("/", protect, getAnnouncements);

// Admin/Faculty can manage announcements
router.post("/", protect, authorize("admin", "faculty"), logMiddleware("Announcement Created"), createAnnouncement);
router.put("/:id", protect, authorize("admin", "faculty"), logMiddleware("Announcement Updated"), updateAnnouncement);
router.delete("/:id", protect, authorize("admin", "faculty"), logMiddleware("Announcement Deleted"), deleteAnnouncement);
router.get("/:id/revisions", protect, authorize("admin", "faculty"), getAnnouncementRevisions);

module.exports = router;
