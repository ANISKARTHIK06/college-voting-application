const Candidate = require("../models/Candidate");

// @desc    Get candidates by election
// @route   GET /api/candidates/election/:voteId
exports.getCandidatesByElection = async (req, res) => {
    try {
        const candidates = await Candidate.find({ voteId: req.params.voteId });
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
exports.getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create candidate profile
// @route   POST /api/candidates
exports.createCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.create(req.body);
        res.status(201).json(candidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update candidate profile
// @route   PUT /api/candidates/:id
exports.updateCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(candidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete candidate profile
// @route   DELETE /api/candidates/:id
exports.deleteCandidate = async (req, res) => {
    try {
        await Candidate.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Candidate removed" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
