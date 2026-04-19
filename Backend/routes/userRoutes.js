const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    updateUserRole,
    getUserById,
    toggleUserStatus,
    bulkImportUsers,
    searchUsers,
    getAllStudents
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Protect all routes
router.use(protect);

// Allow any authenticated user to search or get students
router.get("/search", searchUsers);
router.get("/students", getAllStudents);

// The rest are admin only (except GET / which allows faculty too)
router.get("/", authorize("admin", "faculty"), getAllUsers);

router.use(authorize("admin"));

router.post("/import", bulkImportUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/status", toggleUserStatus);

module.exports = router;
