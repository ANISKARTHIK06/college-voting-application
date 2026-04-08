const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequests,
    getMyRequests,
    reviewRequest,
} = require('../controllers/electionRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');
const logMiddleware = require('../middleware/logMiddleware');

router.get('/mine', protect, getMyRequests);
router.get('/', protect, authorize('admin', 'faculty'), getRequests);
router.post('/', protect, logMiddleware('Election Request Submitted'), createRequest);
router.patch('/:id', protect, authorize('admin', 'faculty'), logMiddleware('Election Request Reviewed'), reviewRequest);

module.exports = router;
