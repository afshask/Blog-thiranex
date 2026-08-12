const express = require("express");

const router = express.Router();

const {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");


// Create post
router.post("/", authMiddleware, createPost);


// Get all posts
router.get("/", authMiddleware, getAllPosts);


// Get single post
router.get("/:id", authMiddleware, getPost);


// Update post
router.put("/:id", authMiddleware, updatePost);


// Delete post
router.delete("/:id", authMiddleware, deletePost);


module.exports = router;