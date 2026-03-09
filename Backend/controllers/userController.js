const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort("-createdAt");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role (Promote/Demote)
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!["admin", "user"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Toggle user active status
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isActive = !user.isActive;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk import users
// @route   POST /api/users/import
// @access  Private/Admin
exports.bulkImportUsers = async (req, res) => {
    try {
        const { users } = req.body;
        if (!users || !Array.isArray(users)) {
            return res.status(400).json({ message: "Invalid user data provided" });
        }

        // Add default password if missing and other required fields
        const usersToCreate = users.map(u => ({
            ...u,
            password: u.password || "College@123", // Default secure-ish password
            role: "user"
        }));

        const createdUsers = await User.insertMany(usersToCreate, { ordered: false });
        res.status(201).json({ 
            message: `Successfully imported ${createdUsers.length} users`,
            count: createdUsers.length 
        });
    } catch (error) {
        // Handle partial success/duplicates
        if (error.code === 11000) {
            return res.status(201).json({ 
                message: "Imported users, but skipped some duplicates",
                count: error.result?.nInserted || 0
            });
        }
        res.status(500).json({ message: error.message });
    }
};
