const ElectionRequest = require('../models/ElectionRequest');
const Vote = require('../models/Vote');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc  Submit a new election request
// @route POST /api/election-requests
// @access Private (student/faculty)
exports.createRequest = async (req, res) => {
    try {
        const request = await ElectionRequest.create({
            ...req.body,
            requestedBy: req.user._id,
        });
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc  Get all election requests
// @route GET /api/election-requests
// @access Private (admin)
exports.getRequests = async (req, res) => {
    try {
        const requests = await ElectionRequest.find()
            .populate('requestedBy', 'name email department role')
            .populate('reviewedBy', 'name')
            .sort('-createdAt');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc  Get my own requests
// @route GET /api/election-requests/mine
// @access Private
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await ElectionRequest.find({ requestedBy: req.user._id })
            .sort('-createdAt');
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc  Review (approve/reject) a request
// @route PATCH /api/election-requests/:id
// @access Private (admin)
exports.reviewRequest = async (req, res) => {
    try {
        const { status, reviewNote } = req.body;
        const request = await ElectionRequest.findById(req.params.id).populate('requestedBy');
        if (!request) return res.status(404).json({ message: 'Request not found' });

        request.status = status;
        request.reviewedBy = req.user._id;
        request.reviewNote = reviewNote || '';
        await request.save();

        // If approved → auto-create the vote as a draft
        if (status === 'approved') {
            await Vote.create({
                title:          request.title,
                description:    request.description,
                votingType:     request.votingType,
                eligibleGroup:  request.eligibleGroup,
                eligibleValues: request.eligibleValues,
                startTime:      request.startTime,
                endTime:        request.endTime,
                createdBy:      req.user._id,
                status:         'draft',
                candidates:     request.candidates || [],
            });
        }

        // Notify the student of the decision
        await Notification.create({
            userId:      request.requestedBy._id,
            title:       status === 'approved' ? '✅ Election Request Approved' : '❌ Election Request Rejected',
            description: status === 'approved'
                ? `Your election proposal "${request.title}" has been approved! It has been added as a draft election.`
                : `Your election proposal "${request.title}" was not approved. Note: ${reviewNote || 'No reason provided.'}`,
            type: 'election',
        });

        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
