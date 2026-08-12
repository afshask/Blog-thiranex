const express = require("express");

const router = express.Router();

const {
    createComment,
    getComments,
    deleteComment
} = require("../controllers/commentController");

const authMiddleware = require("../middleware/authMiddleware");


// Add comment to a post
router.post(
    "/post/:postId",
    authMiddleware,
    createComment
);


// Get comments for a post
router.get(
    "/post/:postId",
    authMiddleware,
    getComments
);


// Delete comment
router.delete(
    "/:id",
    authMiddleware,
    deleteComment
);


module.exports = router;