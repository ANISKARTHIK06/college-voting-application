const { logAction } = require("../controllers/activityController");

const logMiddleware = (action) => {
    return (req, res, next) => {
        const originalSend = res.send;
        res.send = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Only log successful actions
                const userId = req.user ? req.user.id : null;
                if (userId) {
                    const ip = req.ip || req.connection.remoteAddress;
                    logAction(userId, action, `Path: ${req.originalUrl}, Method: ${req.method}`, ip);
                }
            }
            originalSend.apply(res, arguments);
        };
        next();
    };
};

module.exports = logMiddleware;
