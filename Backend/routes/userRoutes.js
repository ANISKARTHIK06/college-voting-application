const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    updateUserRole,
    getUserById,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All user routes are admin only
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", updateUserRole);

module.exports = router;
