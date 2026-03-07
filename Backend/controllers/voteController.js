const Vote = require("../models/Vote");
const VotesCast = require("../models/VotesCast");

// @desc    Create new vote
// @route   POST /api/votes
// @access  Private/Admin
exports.createVote = async (req, res) => {
    try {
        const vote = await Vote.create({
            ...req.body,
            createdBy: req.user._id,
        });

        res.status(201).json(vote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all votes (filtered by status and eligibility for users)
// @route   GET /api/votes
// @access  Private
exports.getVotes = async (req, res) => {
    try {
        let query = {};

        // If not admin, filter by status and eligibility
        if (req.user.role !== "admin") {
            query.status = { $in: ["active", "published"] };
            // Add eligibility check here if needed (e.g., department match)
        }

        const votes = await Vote.find(query).sort("-createdAt");
        res.json(votes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single vote
// @route   GET /api/votes/:id
// @access  Private
exports.getVoteById = async (req, res) => {
    try {
        const vote = await Vote.findById(req.params.id);
        if (!vote) return res.status(404).json({ message: "Vote not found" });

        // Check if user already voted
        const hasVoted = await VotesCast.findOne({ voteId: vote._id, userId: req.user._id });

        res.json({ ...vote._doc, hasVoted: !!hasVoted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cast a vote
// @route   POST /api/votes/:id/cast
// @access  Private
exports.castVote = async (req, res) => {
    try {
        const vote = await Vote.findById(req.params.id);
        if (!vote) return res.status(404).json({ message: "Vote not found" });

        if (vote.status !== "active") {
            return res.status(400).json({ message: "Voting is not currently active for this event" });
        }

        // Double check time
        const now = new Date();
        if (now < vote.startTime || now > vote.endTime) {
            return res.status(400).json({ message: "Voting period has either not started or has already ended" });
        }

        // Logic for unique vote (userId + voteId) handled by DB index, but good to check
        const alreadyVoted = await VotesCast.findOne({ voteId: vote._id, userId: req.user._id });
        if (alreadyVoted) {
            return res.status(400).json({ message: "You have already cast your vote for this event" });
        }

        const { candidateId, rankings, selections } = req.body;

        await VotesCast.create({
            voteId: vote._id,
            userId: req.user._id,
            candidateId,
            rankings,
            selections,
        });

        res.status(201).json({ message: "Vote cast successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "You have already cast your vote for this event" });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get results for a vote
// @route   GET /api/votes/:id/results
// @access  Private
exports.getResults = async (req, res) => {
    try {
        const vote = await Vote.findById(req.params.id);
        if (!vote) return res.status(404).json({ message: "Vote not found" });

        // Results only published after it ends (or for admin)
        if (vote.status !== "published" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Results are not yet published" });
        }

        const votes = await VotesCast.find({ voteId: vote._id });

        // Basic count logic for "Election" and "Approval" types
        const results = {};
        vote.candidates.forEach((c) => {
            results[c._id] = 0;
        });

        votes.forEach((v) => {
            if (v.candidateId && results[v.candidateId] !== undefined) {
                results[v.candidateId]++;
            }
        });

        res.json({
            vote,
            totalVotes: votes.length,
            results,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update vote status
// @route   PATCH /api/votes/:id/status
// @access  Private/Admin
exports.updateVoteStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const vote = await Vote.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(vote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
