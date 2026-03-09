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
const logMiddleware = require("../middleware/logMiddleware");

router.get("/", protect, getVotes);
router.get("/:id", protect, getVoteById);
router.get("/:id/results", protect, getResults);

// Admin/Committee Member actions
router.post("/", protect, authorize("admin", "faculty"), logMiddleware("Election Created"), createVote);
router.patch("/:id/status", protect, authorize("admin", "faculty"), logMiddleware("Election Status Updated"), updateVoteStatus);

// User actions
router.post("/:id/cast", protect, logMiddleware("Vote Cast"), castVote);

module.exports = router;
