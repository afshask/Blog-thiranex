const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).send("Please login first");
    }

    next();
};

module.exports = authMiddleware;