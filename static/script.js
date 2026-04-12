/* -------------------------------------------------------
   INITIAL DATA
------------------------------------------------------- */
const START_DATA = {
    categories: [
        "Coding", "Baking", "Art", "AI in Hobbies",
        "Music", "Gardening", "3D Printing"
    ],

    aiTools: [
        { name: "Stable Diffusion", desc: "Image generation for art and design." },
        { name: "ChatGPT", desc: "Writing, brainstorming, summarisation." },
        { name: "Luma Labs", desc: "3D model generation (example)." }
    ],

    posts: [
        {
            id: "p1",
            title: "Beginner 3D Printing Guide",
            description: "A step-by-step tutorial for beginners.",
            category: "3D Printing",
            link: "https://example.com/3d-guide",
            image: null,
            author: "Alice",
            upvotes: 5,
            rating: 4.6,
            comments: [{ name: "Tom", text: "Super helpful!" }],
            created: Date.now() - 86400000
        },
        {
            id: "p2",
            title: "Sourdough Starter Basics",
            description: "How to create and maintain a starter.",
            category: "Baking",
            link: "https://example.com/sourdough",
            image: null,
            author: "Maya",
            upvotes: 8,
            rating: 4.9,
            comments: [],
            created: Date.now() - 172800000
        }
    ],

    users: []
};


/* -------------------------------------------------------
   SHORTCUT FUNCTIONS
------------------------------------------------------- */
const $ = sel => document.querySelector(sel);


/* -------------------------------------------------------
   STATE MANAGEMENT
------------------------------------------------------- */
function loadState() {
    const raw = localStorage.getItem("skillhub_state");
    if (raw) return JSON.parse(raw);

    // first-time load
    localStorage.setItem("skillhub_state", JSON.stringify(START_DATA));
    return JSON.parse(localStorage.getItem("skillhub_state"));
}

function saveState(data) {
    localStorage.setItem("skillhub_state", JSON.stringify(data));
}

let state = loadState();
let currentUser = JSON.parse(localStorage.getItem("skillhub_currentUser") || "null");


/* -------------------------------------------------------
   DOM REFERENCES
------------------------------------------------------- */
const resultsEl = $("#results");
const categoriesList = $("#categoriesList");
const categoryFilter = $("#categoryFilter");
const aiList = $("#aiList");
const profileAvatar = $("#profileAvatar");
const profileName = $("#profileName");
const profileEmail = $("#profileEmail");
const profileSkills = $("#profileSkills");
const editProfileBtn = $("#editProfile");
const logoutBtn = $("#logoutBtn");


/* -------------------------------------------------------
   INIT
------------------------------------------------------- */
function init() {
    if (categoryFilter) populateCategories();
    if (aiList) renderAI();
    if (resultsEl) renderPosts();
    bindUI();
    renderProfile();
}


/* -------------------------------------------------------
   CATEGORIES
------------------------------------------------------- */
function populateCategories() {
    categoryFilter.innerHTML =
        `<option value="all">All categories</option>` +
        state.categories.map(c => `<option value="${c}">${c}</option>`).join("");

    if (categoriesList) {
        categoriesList.innerHTML = state.categories
            .map(c => `<button class="pill" data-category="${c}">${c}</button>`)
            .join("");
    }
}


/* -------------------------------------------------------
   AI TOOLS
------------------------------------------------------- */
function renderAI() {
    aiList.innerHTML = state.aiTools
        .map(t => `<li><strong>${escapeHtml(t.name)}</strong> — ${escapeHtml(t.desc)}</li>`)
        .join("");
}


/* -------------------------------------------------------
   POSTS (SEARCH, FILTER, SORT)
------------------------------------------------------- */
function renderPosts() {
    if (!resultsEl) return;

    const search = ($("#searchInput")?.value || "").trim().toLowerCase();
    const cat = categoryFilter?.value || "all";
    const sort = $("#sortSelect")?.value || "new";

    let posts = [...state.posts];

    if (search) {
        posts = posts.filter(p =>
            (p.title + p.description + p.author)
                .toLowerCase()
                .includes(search)
        );
    }

    if (cat !== "all") posts = posts.filter(p => p.category === cat);

    posts.sort((a, b) =>
        sort === "top" ? b.upvotes - a.upvotes : b.created - a.created
    );

    resultsEl.innerHTML = posts.map(p => renderPostHtml(p)).join("");

    // attach post events
    resultsEl.querySelectorAll("[data-action='upvote']").forEach(voteBtn => {
        voteBtn.addEventListener("click", e => {
            const id = e.target.closest("[data-id]").getAttribute("data-id");
            upvote(id);
        });
    });

    resultsEl.querySelectorAll("[data-action='comments']").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.closest("[data-id]").getAttribute("data-id");
            openComments(id);
        });
    });
}

function renderPostHtml(p) {
    const categoryTag = `<div class="tag">${escapeHtml(p.category)}</div>`;
    const commentsNum = p.comments.length;

    return `
    <div class="tool card" data-id="${p.id}">
        <div style="display:flex;gap:10px;">
            <div style="flex:1">
                <div style="display:flex;justify-content:space-between;">
                    <div>
                        <div style="font-weight:700">${escapeHtml(p.title)}</div>
                        <div class="muted" style="font-size:13px">
                            Posted by ${escapeHtml(p.author)} • ${new Date(p.created).toLocaleString()}
                        </div>
                    </div>
                    <div class="tags">${categoryTag}</div>
                </div>

                <div style="margin-top:8px">${escapeHtml(p.description)}</div>

                ${p.image
                    ? `<img src="${p.image}" style="margin-top:10px;max-width:100%;border-radius:8px;">`
                    : ""}

                <div style="margin-top:8px">
                    <a href="${escapeHtml(p.link)}" target="_blank">Open resource</a>
                </div>
            </div>
        </div>

        <div style="margin-top:10px;display:flex;justify-content:space-between;">
            <div class="post-actions">
                <div class="upvote" data-action="upvote">▲ <span class="count">${p.upvotes}</span></div>
                <div class="muted" style="font-size:13px">Rating: ${p.rating?.toFixed(1) || "n/a"}</div>
            </div>

            <button data-action="comments" class="btn alt">
                Comments (${commentsNum})
            </button>
        </div>
    </div>`;
}


/* -------------------------------------------------------
   UPVOTES
------------------------------------------------------- */
function upvote(id) {
    const p = state.posts.find(x => x.id === id);
    if (!p) return;

    p.upvotes++;
    saveState(state);
    renderPosts();
}


/* -------------------------------------------------------
   COMMENTS
------------------------------------------------------- */
function openComments(id) {
    const post = state.posts.find(p => p.id === id);
    if (!post) return;

    const html = `
        <h3>Comments for: ${escapeHtml(post.title)}</h3>

        <div id="commentsList">
            ${post.comments.map(c => `
                <div style="padding:8px;border-bottom:1px solid #eee;">
                    <strong>${escapeHtml(c.name)}</strong>
                    <div>${escapeHtml(c.text)}</div>
                </div>
            `).join("")}
        </div>

        <hr>

        <form id="commentForm">
            <label>Name *<br><input id="commentName" required></label>
            <label>Comment *<br><textarea id="commentText" required></textarea></label>
            <button class="btn" type="submit">Add comment</button>
        </form>
    `;

    showModal(html, () => {
        $("#commentForm").addEventListener("submit", e => {
            e.preventDefault();
            const name = $("#commentName").value.trim();
            const text = $("#commentText").value.trim();
            if (!name || !text) return;

            post.comments.push({ name, text });
            saveState(state);
            closeModal();
            openComments(id);
        });
    });
}


/* -------------------------------------------------------
   PROFILE SYSTEM
------------------------------------------------------- */
function renderProfile() {
    if (!profileName) return;

    if (currentUser) {
        profileName.textContent = currentUser.fullName;
        profileEmail.textContent = currentUser.email;
        profileSkills.textContent = (currentUser.skills || []).join(", ");
        profileAvatar.src = currentUser.photo || "";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        profileName.textContent = "Guest";
        profileEmail.textContent = "Not signed in";
        profileSkills.textContent = "";
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

function openProfileModal() {
    showModal(`
        <h3>Create / Edit Profile</h3>

        <form id="profileForm">
            <label>Full Name *<br><input id="pfName" required></label>
            <label>Email *<br><input id="pfEmail" type="email" required></label>
            <label>Pronouns<br><input id="pfPronouns"></label>
            <label>Phone<br><input id="pfPhone"></label>
            <label>Skills (comma separated) *<br><input id="pfSkills"></label>

            <label>Profile Photo<br>
                <input id="pfPhoto" type="file" accept="image/*">
            </label>

            <button class="btn" type="submit">Save Profile</button>
        </form>
    `, () => {
        if (currentUser) {
            $("#pfName").value = currentUser.fullName;
            $("#pfEmail").value = currentUser.email;
            $("#pfPronouns").value = currentUser.pronouns || "";
            $("#pfPhone").value = currentUser.phone || "";
            $("#pfSkills").value = (currentUser.skills || []).join(", ");
        }

        $("#profileForm").addEventListener("submit", e => {
            e.preventDefault();
            const fullName = $("#pfName").value.trim();
            const email = $("#pfEmail").value.trim();
            const pronouns = $("#pfPronouns").value.trim();
            const phone = $("#pfPhone").value.trim();
            const skills = $("#pfSkills").value.split(",").map(s => s.trim()).filter(Boolean);
            const file = $("#pfPhoto").files[0];

            if (!fullName || !email || skills.length === 0) {
                alert("Please fill in required fields.");
                return;
            }

            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    saveUser({
                        fullName,
                        email,
                        pronouns,
                        phone,
                        skills,
                        photo: e.target.result
                    });
                    closeModal();
                };
                reader.readAsDataURL(file);
            } else {
                saveUser({
                    fullName,
                    email,
                    pronouns,
                    phone,
                    skills,
                    photo: currentUser?.photo || ""
                });
                closeModal();
            }
        });
    });
}

function saveUser(user) {
    currentUser = user;
    localStorage.setItem("skillhub_currentUser", JSON.stringify(user));

    const index = state.users.findIndex(u => u.email === user.email);
    if (index >= 0) state.users[index] = user;
    else state.users.push(user);

    saveState(state);
    renderProfile();
}



/* -------------------------------------------------------
   POST MODAL (INCLUDES IMAGE UPLOAD)
------------------------------------------------------- */
function openPostModal() {
    const categoryOptions = state.categories
        .map(c => `<option value="${c}">${c}</option>`).join("");

    showModal(`
        <h3>Share a Resource</h3>

        <form id="postForm">
            <label>Title *<br><input id="postTitle" required></label>
            <label>Description *<br><textarea id="postDesc" required></textarea></label>
            <label>Category *<br><select id="postCategory">${categoryOptions}</select></label>
            <label>Link *<br><input id="postLink" type="url" required></label>

            <label>Image (optional)<br>
                <input id="postImage" type="file" accept="image/*">
            </label>

            <button class="btn" type="submit">Post</button>
        </form>
    `, () => {
        $("#postForm").addEventListener("submit", e => {
            e.preventDefault();

            const title = $("#postTitle").value.trim();
            const desc = $("#postDesc").value.trim();
            const category = $("#postCategory").value;
            const link = $("#postLink").value.trim();
            const file = $("#postImage").files[0];

            if (!title || !desc || !link) return;

            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    createPost(title, desc, category, link, e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                createPost(title, desc, category, link, null);
            }
        });
    });
}

function createPost(title, desc, category, link, image) {
    const newPost = {
        id: "p" + Date.now(),
        title,
        description: desc,
        category,
        link,
        image,
        author: currentUser ? currentUser.fullName : "Guest",
        upvotes: 0,
        rating: 0,
        comments: [],
        created: Date.now()
    };

    state.posts.unshift(newPost);
    saveState(state);
    closeModal();
    renderPosts();
}


/* -------------------------------------------------------
   LOGIN MODAL (OPTIONAL IN INDEX)
------------------------------------------------------- */
function openLoginModal() {
    showModal(`
        <h3>Login / Register</h3>

        <form id="loginForm">
            <label>Email *<br><input id="loginEmail" type="email" required></label>
            <label>Full Name (new users)<br><input id="loginName"></label>
            <button class="btn" type="submit">Continue</button>
        </form>
        <p class="muted">Passwords not required — demonstration only.</p>
    `, () => {
        $("#loginForm").addEventListener("submit", e => {
            e.preventDefault();
            const email = $("#loginEmail").value.trim();
            const name = $("#loginName").value.trim() || "Guest";

            let user = state.users.find(u => u.email === email);

            if (!user) {
                user = { fullName: name, email, skills: [] };
                state.users.push(user);
                saveState(state);
            }

            currentUser = user;
            localStorage.setItem("skillhub_currentUser", JSON.stringify(user));

            closeModal();
            renderProfile();
        });
    });
}


/* -------------------------------------------------------
   MODAL HANDLING
------------------------------------------------------- */
function showModal(html, onShow) {
    const root = document.getElementById("modalRoot");
    const modal = document.createElement("div");
    modal.className = "modal";

    modal.innerHTML = `
        <div class="card">
            ${html}
            <button id="modalClose" class="btn alt" style="margin-top:15px">Close</button>
        </div>
    `;

    root.innerHTML = "";
    root.appendChild(modal);
    root.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    $("#modalClose").addEventListener("click", closeModal);

    if (onShow) onShow();
}

function closeModal() {
    const root = document.getElementById("modalRoot");
    root.innerHTML = "";
    root.classList.add("hidden");
    document.body.style.overflow = "auto";
}


/* -------------------------------------------------------
   UTILITIES
------------------------------------------------------- */
function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


/* -------------------------------------------------------
   UI EVENT BINDING
------------------------------------------------------- */
function bindUI() {
    if ($("#searchBtn")) $("#searchBtn").addEventListener("click", renderPosts);

    if ($("#clearSearch")) {
        $("#clearSearch").addEventListener("click", () => {
            $("#searchInput").value = "";
            categoryFilter.value = "all";
            renderPosts();
        });
    }

    if (categoryFilter) categoryFilter.addEventListener("change", renderPosts);
    if ($("#sortSelect")) $("#sortSelect").addEventListener("change", renderPosts);

    if ($("#openPost")) $("#openPost").addEventListener("click", openPostModal);
    if (editProfileBtn) editProfileBtn.addEventListener("click", openProfileModal);
    if ($("#openLogin")) $("#openLogin").addEventListener("click", openLoginModal);
    if ($("#openReadme")) $("#openReadme").addEventListener("click", openReadme);

    if (categoriesList) {
        categoriesList.addEventListener("click", e => {
            const target = e.target.closest("[data-category]");
            if (!target) return;

            categoryFilter.value = target.getAttribute("data-category");
            renderPosts();
        });
    }

    if ($("#contactForm")) {
        $("#contactForm").addEventListener("submit", e => {
            e.preventDefault();
            $("#contactFeedback").textContent = "Message sent (simulation).";
            setTimeout(() => {
                $("#contactFeedback").textContent = "";
            }, 2000);
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("skillhub_currentUser");
            location.href = "login.html";
        });
    }
}


/* -------------------------------------------------------
   README MODAL
------------------------------------------------------- */
function openReadme() {
    showModal(`
        <h2>ReadMe — COM4113 Project</h2>

        <p>This prototype demonstrates:</p>
        <ul>
            <li>Login system</li>
            <li>Profile creation + image upload</li>
            <li>Posting resources with image upload</li>
            <li>Search, category filtering, sorting</li>
            <li>Upvotes and comments</li>
            <li>LocalStorage persistence</li>
            <li>Modals, responsive layout, clean UI</li>
        </ul>
    `);
}


/* -------------------------------------------------------
   ESC KEY CLOSES MODAL
------------------------------------------------------- */
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
});


/* -------------------------------------------------------
   START APP
------------------------------------------------------- */
init();
