const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Create comment
const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { postId } = req.params;

        // Check if post exists
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        const comment = await Comment.create({
            content,
            author: req.session.userId,
            post: postId
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate("author", "name email");

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to add comment");
    }
};


// Get comments for a post
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({
            post: req.params.postId
        })
            .populate("author", "name email")
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to fetch comments");
    }
};


// Delete comment
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).send("Comment not found");
        }

        // Only the comment author can delete it
        if (
            comment.author.toString() !==
            req.session.userId.toString()
        ) {
            return res.status(403).send(
                "You can only delete your own comments"
            );
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.send("Comment deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed to delete comment");
    }
};


module.exports = {
    createComment,
    getComments,
    deleteComment
};