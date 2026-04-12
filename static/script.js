// --------------------------------------
// FETCH + LOAD POSTS FROM BACKEND
// --------------------------------------
async function loadPosts() {
    try {
        const res = await fetch("/api/resources");
        const posts = await res.json();
        renderPosts(posts);
    } catch (err) {
        console.error("Error loading posts:", err);
    }
}

// --------------------------------------
// RENDER POSTS
// --------------------------------------
function renderPosts(posts) {
    const resultsEl = document.getElementById("results");
    if (!resultsEl) return;

    resultsEl.innerHTML = posts.map(p => `
        <div class="card" data-id="${p._id}">
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.description)}</p>
            <p><strong>Category:</strong> ${escapeHtml(p.category || "")}</p>
            <p><strong>Upvotes:</strong> ${p.upvotes || 0}</p>

            <button onclick="upvote('${p._id}')">⬆ Upvote</button>

            <form onsubmit="addComment(event, '${p._id}')">
                <input name="comment" placeholder="Add comment" required>
                <button type="submit">Send</button>
            </form>

            <ul>
                ${(p.comments || []).map(c => `<li>${escapeHtml(c)}</li>`).join("")}
            </ul>
        </div>
    `).join("");
}

// --------------------------------------
// CREATE POST
// --------------------------------------
async function createPost(event) {
    event.preventDefault();

    const title = document.getElementById("postTitle").value;
    const description = document.getElementById("postDesc").value;
    const category = document.getElementById("postCategory").value;

    if (!title || !description) {
        alert("Please fill all fields");
        return;
    }

    try {
        await fetch("/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&category=${encodeURIComponent(category)}`
        });

        document.getElementById("postForm").reset();
        loadPosts();

    } catch (err) {
        console.error("Error creating post:", err);
    }
}

// --------------------------------------
// UPVOTE
// --------------------------------------
async function upvote(id) {
    try {
        await fetch(`/upvote/${id}`);
        loadPosts();
    } catch (err) {
        console.error("Error upvoting:", err);
    }
}

// --------------------------------------
// ADD COMMENT
// --------------------------------------
async function addComment(event, id) {
    event.preventDefault();

    const comment = event.target.comment.value;

    if (!comment) return;

    try {
        await fetch(`/comment/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `comment=${encodeURIComponent(comment)}`
        });

        loadPosts();

    } catch (err) {
        console.error("Error adding comment:", err);
    }
}

// --------------------------------------
// SEARCH
// --------------------------------------
async function searchPosts() {
    const query = document.getElementById("searchInput").value;

    try {
        const res = await fetch(`/api/resources?search=${encodeURIComponent(query)}`);
        const posts = await res.json();
        renderPosts(posts);
    } catch (err) {
        console.error("Search error:", err);
    }
}

// --------------------------------------
// SIMPLE HTML ESCAPE (SECURITY)
// --------------------------------------
function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// --------------------------------------
// INIT APP
// --------------------------------------
document.addEventListener("DOMContentLoaded", () => {

    loadPosts();

    // Post form
    const postForm = document.getElementById("postForm");
    if (postForm) {
        postForm.addEventListener("submit", createPost);
    }

    // Search button
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", searchPosts);
    }
});