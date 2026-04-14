// --------------------------------------
// LOAD POSTS FROM BACKEND
// --------------------------------------
async function loadPosts() {
    try {
        const res = await fetch("/api/resources");
        const posts = await res.json();

        populateCategories(posts);
        renderPosts(posts);

    } catch (err) {
        console.error("Error loading posts:", err);
    }
}


// --------------------------------------
// RENDER POSTS (MODERN UI)
// --------------------------------------
function renderPosts(posts) {
    const resultsEl = document.getElementById("results");
    if (!resultsEl) return;

    const sort = document.getElementById("sortSelect")?.value || "new";
    const category = document.getElementById("categoryFilter")?.value || "all";

    // FILTER
    if (category !== "all") {
        posts = posts.filter(p =>
            (p.category || "").toLowerCase() === category.toLowerCase()
        );
    }

    // SORT
    if (sort === "top") {
        posts.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else {
        posts.reverse(); // newest
    }

    // EMPTY STATE
    if (posts.length === 0) {
        resultsEl.innerHTML = "<p class='muted'>No resources found.</p>";
        return;
    }

    // RENDER
    resultsEl.innerHTML = posts.map(p => `
        <div class="card fade-in">
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.description)}</p>

            <div class="tags">
                <span class="tag">${escapeHtml(p.category || "General")}</span>
            </div>

            <div class="post-actions">
                <button class="btn" onclick="upvote('${p._id}')">
                    👍 ${p.upvotes || 0}
                </button>
            </div>

            <form onsubmit="addComment(event, '${p._id}')">
                <input name="comment" placeholder="Add comment..." required>
            </form>

            <ul>
                ${(p.comments || [])
                    .map(c => `<li>${escapeHtml(c)}</li>`)
                    .join("")}
            </ul>
        </div>
    `).join("");
}


// --------------------------------------
// CREATE POST
// --------------------------------------
async function createPost(event) {
    event.preventDefault();

    const title = document.getElementById("postTitle").value.trim();
    const description = document.getElementById("postDesc").value.trim();
    const category = document.getElementById("postCategory").value.trim();

    if (!title || !description) {
        showToast("Please fill in all required fields");
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
        showToast("Resource added successfully ✅");

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

    const comment = event.target.comment.value.trim();
    if (!comment) return;

    try {
        await fetch(`/comment/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `comment=${encodeURIComponent(comment)}`
        });

        event.target.reset();
        loadPosts();

    } catch (err) {
        console.error("Error adding comment:", err);
    }
}


// --------------------------------------
// SEARCH
// --------------------------------------
async function searchPosts() {
    const query = document.getElementById("searchInput").value.trim();

    try {
        const res = await fetch(`/api/resources?search=${encodeURIComponent(query)}`);
        const posts = await res.json();
        renderPosts(posts);
    } catch (err) {
        console.error("Search error:", err);
    }
}


// --------------------------------------
// POPULATE CATEGORY FILTER
// --------------------------------------
function populateCategories(posts) {
    const select = document.getElementById("categoryFilter");
    if (!select) return;

    const categories = new Set();

    posts.forEach(p => {
        if (p.category) categories.add(p.category);
    });

    select.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}


// --------------------------------------
// TOAST NOTIFICATION (MODERN UI)
// --------------------------------------
function showToast(message) {
    let toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "toast";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}


// --------------------------------------
// ESCAPE HTML (SECURITY)
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

    // Form submit
    const postForm = document.getElementById("postForm");
    if (postForm) {
        postForm.addEventListener("submit", createPost);
    }

    // Search
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", searchPosts);
    }

    // Sort & filter
    document.getElementById("sortSelect")?.addEventListener("change", loadPosts);
    document.getElementById("categoryFilter")?.addEventListener("change", loadPosts);
});