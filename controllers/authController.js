const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Store user in session
        req.session.userId = user._id;

        res.send("Registration successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Registration failed");
    }
};


// Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        // Store user in session
        req.session.userId = user._id;

        res.send("Login successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Login failed");
    }
};


// Logout
const logoutUser = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).send("Logout failed");
        }

        res.send("Logout successful");
    });
};


module.exports = {
    registerUser,
    loginUser,
    logoutUser
};