const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Connect MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: "sessions"
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);
// Static files
app.use(express.static(path.join(__dirname, "public")));

// Authentication routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
// Test route
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/", (req, res) => {

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "index.html")
    );
});

app.get("/create-post", (req, res) => {

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "create-post.html")
    );
});

app.get("/post/:id", (req, res) => {

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "post.html")
    );
});
app.get("/edit-post/:id", (req, res) => {

    if (!req.session.userId) {
        return res.redirect("/login");
    }

    res.sendFile(
        path.join(__dirname, "views", "edit-post.html")
    );
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});