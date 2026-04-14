from flask import Flask, render_template, request, redirect, session, jsonify

app = Flask(__name__)
app.secret_key = "supersecretkey"


# --------------------------------------
# DATABASE (IN-MEMORY)
# --------------------------------------


users = []
resources = []


# --------------------------------------
# HOME
# --------------------------------------
@app.route("/")
def home():
    if "user" not in session:
        return redirect("/login")
    return render_template("index.html")


# --------------------------------------
# STATIC PAGES
# --------------------------------------
@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/ai")
def ai():
    return render_template("ai.html")


@app.route("/resources")
def resources_page():
    return render_template("resource.html")


# --------------------------------------
# AUTH (LOGIN / REGISTER)
# --------------------------------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        # Find user
        user = next((u for u in users if u["email"] == email), None)

        if user and user["password"] == password:
            session["user"] = email
            return redirect("/")
        else:
            return "Invalid email or password"

    return render_template("login.html")


@app.route("/register", methods=["POST"])
def register():
    email = request.form.get("email")
    password = request.form.get("password")

    if not email or not password:
        return "Missing fields"

    # Check if user exists
    if any(u["email"] == email for u in users):
        return "User already exists"

    users.append({
        "email": email,
        "password": password,
        "name": "",
        "bio": ""
    })

    return redirect("/login")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


# --------------------------------------
# PROFILE
# --------------------------------------
@app.route("/profile", methods=["GET", "POST"])
def profile():
    if "user" not in session:
        return redirect("/login")

    user = next((u for u in users if u["email"] == session["user"]), None)

    if request.method == "POST":
        user["name"] = request.form.get("name")
        user["bio"] = request.form.get("bio")

    return render_template("profile.html", user=user)


# --------------------------------------
# API (FOR JS FRONTEND)
# --------------------------------------
@app.route("/api/resources")
def api_resources():
    search = request.args.get("search")

    if search:
        filtered = [
            r for r in resources
            if search.lower() in r["title"].lower()
            or search.lower() in r["description"].lower()
        ]
    else:
        filtered = resources

    return jsonify(filtered)


# --------------------------------------
# ADD RESOURCE
# --------------------------------------
@app.route("/add", methods=["POST"])
def add_resource():
    if "user" not in session:
        return jsonify({"error": "Not logged in"}), 401

    title = request.form.get("title")
    description = request.form.get("description")
    category = request.form.get("category")

    if not title or not description:
        return jsonify({"error": "Missing fields"}), 400

    new_resource = {
        "_id": str(len(resources) + 1),
        "title": title,
        "description": description,
        "category": category,
        "upvotes": 0,
        "comments": [],
        "createdBy": session["user"]
    }

    resources.append(new_resource)

    return jsonify({"message": "Resource added"})


# --------------------------------------
# UPVOTE
# --------------------------------------
@app.route("/upvote/<id>")
def upvote(id):
    for r in resources:
        if r["_id"] == id:
            r["upvotes"] += 1
            return jsonify({"message": "Upvoted"})

    return jsonify({"error": "Not found"}), 404


# --------------------------------------
# COMMENT
# --------------------------------------
@app.route("/comment/<id>", methods=["POST"])
def comment(id):
    text = request.form.get("comment")

    if not text:
        return jsonify({"error": "Empty comment"}), 400

    for r in resources:
        if r["_id"] == id:
            r["comments"].append(text)
            return jsonify({"message": "Comment added"})

    return jsonify({"error": "Not found"}), 404


# --------------------------------------
# ERROR HANDLING
# --------------------------------------
@app.errorhandler(404)
def not_found(e):
    return "404 - Page Not Found", 404


@app.errorhandler(500)
def server_error(e):
    return "500 - Internal Server Error", 500


# --------------------------------------
# RUN APP
# --------------------------------------
if __name__ == "__main__":
    app.run(debug=True)