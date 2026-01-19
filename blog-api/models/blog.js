import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        default: "Anonymous"
    },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;