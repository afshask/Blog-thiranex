const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser
} = require("../controllers/authController");


// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.get("/logout", logoutUser);

router.get("/current-user", async (req, res) => {

    try {

        if (!req.session.userId) {
            return res.status(401).json({
                loggedIn: false
            });
        }

        const User = require("../models/User");

        const user = await User.findById(req.session.userId)
            .select("name email");

        if (!user) {
            return res.status(401).json({
                loggedIn: false
            });
        }

        res.json({
            loggedIn: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to get current user"
        });
    }
});
module.exports = router;