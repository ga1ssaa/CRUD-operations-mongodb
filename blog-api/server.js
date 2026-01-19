import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import Blog from './models/blog.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const __dirname = new URL('.', import.meta.url).pathname;

mongoose
    .connect('mongodb+srv://gaisaaldiyar_db_user:Blog12345@cluster0.h3uihok.mongodb.net/blogdb?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB error:', err));

app.use(express.static(path.join(__dirname, '../frontend')));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.post("/blogs", async (req, res) => {
    try {
        const { title, body, author } = req.body;
        if (!title || !body) {
            return res.status(400).json({ error: "Title and body are required" });
        }
        const blog = await Blog.create({ title, body, author });
        res.status(201).json(blog);
    } catch (e) {
        res.status(500).json({ error: "Failed to create blog" });
    }
});

app.get("/blogs", async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch {
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
});

app.get("/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ error: "Not found" });
        res.json(blog);
    } catch {
        res.status(400).json({ error: "Invalid ID" });
    }
});

app.put("/blogs/:id", async (req, res) => {
    try {
        const { title, body, author } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, body, author }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ error: "Update failed" });
    }
});

app.delete("/blogs/:id", async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.status(404).json({ error: "Not found" });
        res.json({ message: "Deleted" });
    } catch {
        res.status(400).json({ error: "Delete failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});