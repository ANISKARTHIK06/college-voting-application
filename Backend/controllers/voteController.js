const Vote = require('../models/Vote');
const VotesCast = require('../models/VotesCast');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create new vote
// @route   POST /api/votes
// @access  Private/Admin
exports.createVote = async (req, res) => {
    try {
        const vote = new Vote({
            ...req.body,
            createdBy: req.user._id,
        });
        await vote.save();

        // Notify eligible users if election is launched immediately (active)
        if (vote.status === 'active') {
            const users = await User.find({ role: 'user' }); // Simplification, could filter by eligibleGroup
            const notifications = users.map(u => ({
                userId: u._id,
                title: "🗳️ New Election Announced",
                description: `A new election "${vote.title}" is now open for bidding. Head to the booth to participate.`,
                type: 'election'
            }));
            await Notification.insertMany(notifications);
        }

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
        const now = new Date();

        // 1. Any vote whose end time has passed should be "ended"
        await Vote.updateMany(
            { status: { $in: ["draft", "active"] }, endTime: { $lte: now } },
            { $set: { status: "ended" } }
        );

        // 2. Any "draft" vote whose start time has passed and end time has not passed should be "active"
        await Vote.updateMany(
            { status: "draft", startTime: { $lte: now }, endTime: { $gt: now } },
            { $set: { status: "active" } }
        );

        // 3. Any "active" vote whose start time is in the future should be reversed to "draft"
        await Vote.updateMany(
            { status: "active", startTime: { $gt: now } },
            { $set: { status: "draft" } }
        );

        let query = {};

        // If not admin, filter by status and eligibility
        if (req.user.role !== "admin") {
            const user = req.user;
            console.log('DEBUG: User Role:', user.role);
            console.log('DEBUG: User Type:', user.userType);
            console.log('DEBUG: User Dept:', user.department);
            console.log('DEBUG: User Pos:', user.position);
            
            query.status = { $in: ["active", "ended", "published"] };
            
            // Audience filtering logic: Only show what matches the user's profile
            const conditions = [
                { eligibleGroup: "All Users" }
            ];

            if (user.userType === 'staff') {
                conditions.push({ eligibleGroup: "Staff Only" });

                if (user.department) {
                    conditions.push({ 
                        eligibleGroup: "Staff Department", 
                        eligibleValues: user.department 
                    });
                }

                if (user.position) {
                    conditions.push({ 
                        eligibleGroup: "Staff Position", 
                        eligibleValues: user.position 
                    });
                }

                if (user.department && user.position) {
                    conditions.push({
                        eligibleGroup: "Staff Department & Position",
                        eligibleValues: { $all: [user.department, user.position] }
                    });
                }
            } else if (user.userType === 'student') {
                if (user.department) {
                    conditions.push({ 
                        eligibleGroup: "Department", 
                        eligibleValues: user.department 
                    });
                }

                if (user.position) {
                    conditions.push({ 
                        eligibleGroup: "Year", 
                        eligibleValues: user.position 
                    });
                }

                if (user.department && user.position) {
                    conditions.push({
                        eligibleGroup: "Department & Year",
                        eligibleValues: { $all: [user.department, user.position] }
                    });
                }
            }

            query.$or = conditions;
        }

        console.log('DEBUG: Final Query:', JSON.stringify(query, null, 2));
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
        const now = new Date();

        // Auto-update status for this specific vote before fetching
        await Vote.updateMany(
            { _id: req.params.id, status: { $in: ["draft", "active"] }, endTime: { $lte: now } },
            { $set: { status: "ended" } }
        );
        await Vote.updateMany(
            { _id: req.params.id, status: "draft", startTime: { $lte: now }, endTime: { $gt: now } },
            { $set: { status: "active" } }
        );
        await Vote.updateMany(
            { _id: req.params.id, status: "active", startTime: { $gt: now } },
            { $set: { status: "draft" } }
        );

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

        const { candidateId } = req.body;

        await VotesCast.create({
            voteId: vote._id,
            userId: req.user._id,
            candidateId,
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

        // Results visible when published OR when ended (for all), or always for admin
        if (vote.status !== "published" && vote.status !== "ended" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Results are not yet published" });
        }

        const votes = await VotesCast.find({ voteId: vote._id }).populate('userId', 'department');

        // Results logic
        const results = {};
        const departmentTurnout = {}; // { "CS": 10, "IT": 5 }
        
        vote.candidates.forEach((c) => {
            results[c._id] = 0;
        });

        votes.forEach((v) => {
            // Candidate counts
            if (v.candidateId && results[v.candidateId] !== undefined) {
                results[v.candidateId]++;
            }
            
            // Department turnout
            if (v.userId && v.userId.department) {
                const dept = v.userId.department;
                departmentTurnout[dept] = (departmentTurnout[dept] || 0) + 1;
            }
        });

        res.json({
            vote,
            totalVotes: votes.length,
            results,
            departmentTurnout
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
        const vote = await Vote.findById(req.params.id);
        if (!vote) return res.status(404).json({ message: "Vote not found" });

        vote.status = status;
        await vote.save();

        // Trigger Notifications based on status change
        if (status === 'active') {
            const users = await User.find({ role: 'user' });
            const notifications = users.map(u => ({
                userId: u._id,
                title: "🚀 Election Launched",
                description: `Voting for "${vote.title}" has officially started. Securely cast your ballot now.`,
                type: 'election'
            }));
            await Notification.insertMany(notifications);
        } else if (status === 'published') {
            const users = await User.find({ role: 'user' });
            const notifications = users.map(u => ({
                userId: u._id,
                title: "🏆 Results Published",
                description: `The certified results for "${vote.title}" are now available for public review.`,
                type: 'result'
            }));
            await Notification.insertMany(notifications);
        }

        res.json(vote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get list of users who voted in a specific election
// @route   GET /api/votes/:id/voters
// @access  Private/Admin
exports.getVoters = async (req, res) => {
    try {
        const votesCast = await VotesCast.find({ voteId: req.params.id })
            .populate('userId', 'name email department role')
            .sort('-createdAt');

        const voters = votesCast.map(v => ({
            _id:         v._id,
            user:        v.userId,
            candidateId: v.candidateId,
            votedAt:     v.timestamp,
        }));

        res.json({ total: voters.length, voters });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get personal voting history for logged-in user
// @route   GET /api/votes/my-history
// @access  Private
exports.getMyHistory = async (req, res) => {
    try {
        const now = new Date();
        await Vote.updateMany(
            { status: { $in: ["draft", "active"] }, endTime: { $lte: now } },
            { $set: { status: "ended" } }
        );
        await Vote.updateMany(
            { status: "draft", startTime: { $lte: now }, endTime: { $gt: now } },
            { $set: { status: "active" } }
        );
        await Vote.updateMany(
            { status: "active", startTime: { $gt: now } },
            { $set: { status: "draft" } }
        );

        const votesCast = await VotesCast.find({ userId: req.user._id })
            .populate('voteId')
            .sort('-timestamp');

        const history = votesCast
            .filter(v => v.voteId)   // skip orphan records
            .map(v => {
                const vote     = v.voteId;
                const candidate = vote.candidates.find(
                    c => c._id.toString() === (v.candidateId || '').toString()
                );
                return {
                    voteId:      vote._id,
                    title:       vote.title,
                    description: vote.description,
                    eligibleGroup: vote.eligibleGroup,
                    status:      vote.status,
                    endTime:     vote.endTime,
                    votedAt:     v.timestamp,
                    votedFor:    candidate || null,
                    candidates:  vote.candidates,
                };
            });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
