const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    updateUserRole,
    getUserById,
    toggleUserStatus,
    bulkImportUsers
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All user routes are admin only
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAllUsers);
router.post("/import", bulkImportUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/status", toggleUserStatus);

module.exports = router;
