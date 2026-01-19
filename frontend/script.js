const form = document.getElementById('blogForm');
const blogsDiv = document.getElementById('blogs');
let blogs = [];

async function fetchBlogs() {
    try {
        const res = await fetch('http://localhost:3000/blogs');
        blogs = await res.json();
        blogsDiv.innerHTML = '';

        blogs.forEach(blog => {
            const blogDiv = document.createElement('div');
            blogDiv.classList.add('blog-item');
            blogDiv.id = blog._id;
            blogDiv.innerHTML = `
                <h3>${blog.title}</h3>
                <p>${blog.body}</p>
                <small>✍️ ${blog.author} | 🕒 ${new Date(blog.createdAt).toLocaleString()}</small>
                <button onclick="editBlog('${blog._id}')">Edit</button>
                <button onclick="deleteBlog('${blog._id}')">Delete</button>
            `;
            blogsDiv.appendChild(blogDiv);
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const author = document.getElementById('author').value || "Anonymous";

    const newBlog = { title, body, author };

    const res = await fetch('http://localhost:3000/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog),
    });

    if (res.ok) {
        fetchBlogs();
        form.reset();
    } else {
        console.error('Error creating blog');
    }
});

async function deleteBlog(id) {
    const res = await fetch(`http://localhost:3000/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) fetchBlogs();
    else console.error('Error deleting blog');
}

async function editBlog(id) {
    const blog = blogs.find(b => b._id === id);

    if (blog) {
        const newTitle = prompt('Edit Title:', blog.title);
        const newBody = prompt('Edit Body:', blog.body);
        const newAuthor = prompt('Edit Author:', blog.author);

        if (newTitle && newBody && newAuthor) {
            const updatedBlog = {
                ...blog,
                title: newTitle,
                body: newBody,
                author: newAuthor
            };

            try {
                const response = await fetch(`http://localhost:3000/blogs/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedBlog)
                });

                if (response.ok) {
                    fetchBlogs();
                } else {
                    console.error('Error updating blog');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }
}

fetchBlogs();