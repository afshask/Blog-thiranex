const Post = require("../models/Post");

// Create a post
const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.create({
            title,
            content,
            author: req.session.userId
        });

        res.status(201).json({
            message: "Post created successfully",
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to create post");
    }
};


// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch posts");
    }
};


// Get one post
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "name email");

        if (!post) {
            return res.status(404).send("Post not found");
        }

        res.json(post);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch post");
    }
};


// Update a post
const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Only the author can edit
        if (post.author.toString() !== req.session.userId.toString()) {
            return res.status(403).send("You can only edit your own posts");
        }

        post.title = title;
        post.content = content;

        await post.save();

        res.json({
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to update post");
    }
};


// Delete a post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        // Only the author can delete
        if (post.author.toString() !== req.session.userId.toString()) {
            return res.status(403).send("You can only delete your own posts");
        }

        await Post.findByIdAndDelete(req.params.id);

        res.send("Post deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete post");
    }
};


module.exports = {
    createPost,
    getAllPosts,
    getPost,
    updatePost,
    deletePost
};