const User = require("../models/User");
const jwt = require("jsonwebtoken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, userType, department, position } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: "An account with this email address already exists." });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || "student", // Default to student if not specified
            userType: userType || "student", // Default to student
            department,
            position,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userType: user.userType,
                department: user.department,
                position: user.position,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            console.log("Login failed: missing email or password");
            return res.status(400).json({
                message: "Please provide both email and password",
                received: { email: !!email, password: !!password }
            });
        }

        console.log(`Login attempt for email: "${email}", password length: ${password.length}`);

        // Check for user email (case-insensitive)
        const user = await User.findOne({ email: { $regex: new RegExp('^' + email.trim() + '$', 'i') } }).select("+password");
        
        if (!user) console.log(`User not found for email: "${email}"`);
        else console.log(`User found. Checking password...`);

        if (user && (await user.matchPassword(password))) {
            console.log(`Login successful for ${email}`);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                userType: user.userType,
                department: user.department,
                position: user.position,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
