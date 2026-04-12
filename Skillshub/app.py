from flask import Flask, render_template, request, redirect, session, jsonify
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId

app = Flask(__name__)
app.secret_key = "supersecretkey"

# ---------------- DATABASE ----------------
client = MongoClient("mongodb://localhost:27017/")
db = client["skillswap"]

bcrypt = Bcrypt(app)

# ---------------- HOME ----------------
@app.route("/")
def home():
    if "user" not in session:
        return redirect("/login")

    return render_template("index.html")


# ---------------- API (FOR JS) ----------------
@app.route("/api/resources")
def api_resources():
    search = request.args.get("search")

    if search:
        resources = db.resources.find({
            "$or": [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        })
    else:
        resources = db.resources.find()

    result = []
    for r in resources:
        r["_id"] = str(r["_id"])
        result.append(r)

    return jsonify(result)


# ---------------- AUTH ----------------
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        user = db.users.find_one({"email": email})

        if user and bcrypt.check_password_hash(user["password"], password):
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

    if db.users.find_one({"email": email}):
        return "User already exists"

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    db.users.insert_one({
        "email": email,
        "password": hashed_pw,
        "name": "",
        "bio": "",
        "hobbies": [],
        "bookmarks": []
    })

    return redirect("/login")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")


# ---------------- PROFILE ----------------
@app.route("/profile", methods=["GET", "POST"])
def profile():
    if "user" not in session:
        return redirect("/login")

    if request.method == "POST":
        db.users.update_one(
            {"email": session["user"]},
            {"$set": {
                "name": request.form.get("name"),
                "bio": request.form.get("bio")
            }}
        )

    user = db.users.find_one({"email": session["user"]})
    return render_template("profile.html", user=user)


# ---------------- ADD RESOURCE ----------------
@app.route("/add", methods=["POST"])
def add_resource():
    if "user" not in session:
        return jsonify({"error": "Not logged in"}), 401

    title = request.form.get("title")
    description = request.form.get("description")
    category = request.form.get("category")

    if not title or not description:
        return jsonify({"error": "Missing fields"}), 400

    db.resources.insert_one({
        "title": title,
        "description": description,
        "category": category,
        "upvotes": 0,
        "comments": [],
        "createdBy": session["user"]
    })

    return jsonify({"message": "Resource added"})


# ---------------- UPVOTE ----------------
@app.route("/upvote/<id>")
def upvote(id):
    try:
        db.resources.update_one(
            {"_id": ObjectId(id)},
            {"$inc": {"upvotes": 1}}
        )
        return jsonify({"message": "Upvoted"})
    except:
        return jsonify({"error": "Invalid ID"}), 400


# ---------------- COMMENT ----------------
@app.route("/comment/<id>", methods=["POST"])
def comment(id):
    text = request.form.get("comment")

    if not text:
        return jsonify({"error": "Empty comment"}), 400

    try:
        db.resources.update_one(
            {"_id": ObjectId(id)},
            {"$push": {"comments": text}}
        )
        return jsonify({"message": "Comment added"})
    except:
        return jsonify({"error": "Invalid ID"}), 400


# ---------------- BOOKMARK ----------------
@app.route("/bookmark/<id>")
def bookmark(id):
    if "user" not in session:
        return redirect("/login")

    db.users.update_one(
        {"email": session["user"]},
        {"$addToSet": {"bookmarks": id}}
    )

    return redirect("/")


# ---------------- ERRORS ----------------
@app.errorhandler(404)
def not_found(e):
    return "404 - Page Not Found", 404


@app.errorhandler(500)
def server_error(e):
    return "500 - Internal Server Error", 500


# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)