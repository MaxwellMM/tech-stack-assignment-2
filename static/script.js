/* --------------------------------------
   GLOBAL STATE
-------------------------------------- */
let allPosts = [];


/* --------------------------------------
   LOAD POSTS FROM FLASK API
-------------------------------------- */
async function loadPosts() {
    try {
        const res = await fetch("/api/resources");
        const data = await res.json();

        allPosts = data;
        renderPosts(allPosts);

    } catch (err) {
        console.error("Error loading posts:", err);
    }
}


/* --------------------------------------
   RENDER POSTS
-------------------------------------- */
function renderPosts(posts) {
    const container = document.getElementById("results");
    if (!container) return;

    if (posts.length === 0) {
        container.innerHTML = "<p class='muted'>No resources found.</p>";
        return;
    }

    container.innerHTML = posts.map(p => `
        <div class="card tool" data-id="${p._id}">
            <h3>${escapeHtml(p.title)}</h3>

            <p class="muted">
                ${new Date(p.createdAt || Date.now()).toLocaleString()}
            </p>

            <p>${escapeHtml(p.description)}</p>

            <div class="tags">
                <span class="tag">${escapeHtml(p.category || "General")}</span>
            </div>

            <div class="post-actions">
                <button class="btn alt" onclick="upvote('${p._id}')">
                    ▲ ${p.upvotes || 0}
                </button>
            </div>

            <div style="margin-top:10px">
                <strong>Comments:</strong>

                <ul>
                    ${(p.comments || [])
                        .map(c => `<li>${escapeHtml(c)}</li>`)
                        .join("")}
                </ul>

                <form onsubmit="addComment(event, '${p._id}')">
                    <input name="comment" placeholder="Write a comment..." required>
                    <button class="btn">Post</button>
                </form>
            </div>
        </div>
    `).join("");
}


/* --------------------------------------
   CREATE POST
-------------------------------------- */
async function createPost(e) {
    e.preventDefault();

    const title = document.getElementById("postTitle").value.trim();
    const description = document.getElementById("postDesc").value.trim();
    const category = document.getElementById("postCategory").value.trim();

    if (!title || !description) {
        alert("Please fill all required fields");
        return;
    }

    try {
        const res = await fetch("/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&category=${encodeURIComponent(category)}`
        });

        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        document.getElementById("postForm").reset();
        loadPosts();

    } catch (err) {
        console.error("Error creating post:", err);
    }
}


/* --------------------------------------
   UPVOTE
-------------------------------------- */
async function upvote(id) {
    try {
        await fetch(`/upvote/${id}`);
        loadPosts();
    } catch (err) {
        console.error("Upvote error:", err);
    }
}


/* --------------------------------------
   ADD COMMENT
-------------------------------------- */
async function addComment(e, id) {
    e.preventDefault();

    const comment = e.target.comment.value.trim();

    if (!comment) return;

    try {
        await fetch(`/comment/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `comment=${encodeURIComponent(comment)}`
        });

        e.target.reset();
        loadPosts();

    } catch (err) {
        console.error("Comment error:", err);
    }
}


/* --------------------------------------
   SEARCH
-------------------------------------- */
async function searchPosts() {
    const query = document.getElementById("searchInput").value.trim();

    try {
        const res = await fetch(`/api/resources?search=${encodeURIComponent(query)}`);
        const data = await res.json();

        renderPosts(data);

    } catch (err) {
        console.error("Search error:", err);
    }
}


/* --------------------------------------
   FILTER + SORT (FIRST CLASS FEATURE)
-------------------------------------- */
function applyFilters() {
    const category = document.getElementById("categoryFilter")?.value;
    const sort = document.getElementById("sortSelect")?.value;

    let filtered = [...allPosts];

    // Filter
    if (category && category !== "all") {
        filtered = filtered.filter(p => p.category === category);
    }

    // Sort
    if (sort === "top") {
        filtered.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    } else {
        filtered.sort((a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );
    }

    renderPosts(filtered);
}


/* --------------------------------------
   SECURITY (XSS PROTECTION)
-------------------------------------- */
function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


/* --------------------------------------
   EVENT LISTENERS
-------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {

    loadPosts();

    // Create post
    const form = document.getElementById("postForm");
    if (form) form.addEventListener("submit", createPost);

    // Search
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) searchBtn.addEventListener("click", searchPosts);

    // Clear search
    const clearBtn = document.getElementById("clearSearch");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            document.getElementById("searchInput").value = "";
            loadPosts();
        });
    }

    // Filter + Sort
    const categoryFilter = document.getElementById("categoryFilter");
    const sortSelect = document.getElementById("sortSelect");

    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
    if (sortSelect) sortSelect.addEventListener("change", applyFilters);
});