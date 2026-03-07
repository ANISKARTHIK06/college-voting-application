const express = require("express");
const router = express.Router();
const {
    createVote,
    getVotes,
    getVoteById,
    castVote,
    getResults,
    updateVoteStatus,
} = require("../controllers/voteController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getVotes);
router.get("/:id", protect, getVoteById);
router.post("/:id/cast", protect, castVote);
router.get("/:id/results", protect, getResults);

// Admin only
router.post("/", protect, authorize("admin"), createVote);
router.patch("/:id/status", protect, authorize("admin"), updateVoteStatus);

module.exports = router;
