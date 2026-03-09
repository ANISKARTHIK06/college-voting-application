const express = require("express");
const router = express.Router();
const {
    getCandidatesByElection,
    getCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
} = require("../controllers/candidateController");
const { protect, authorize } = require("../middleware/authMiddleware");
const logMiddleware = require("../middleware/logMiddleware");

router.get("/election/:voteId", protect, getCandidatesByElection);
router.get("/:id", protect, getCandidateById);

// Admin/Faculty management
router.post("/", protect, authorize("admin", "faculty"), logMiddleware("Candidate Profile Created"), createCandidate);
router.put("/:id", protect, authorize("admin", "faculty"), logMiddleware("Candidate Profile Updated"), updateCandidate);
router.delete("/:id", protect, authorize("admin", "faculty"), logMiddleware("Candidate Profile Deleted"), deleteCandidate);

module.exports = router;
