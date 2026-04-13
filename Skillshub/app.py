from flask import Flask, render_template, request, redirect, session, jsonify
from pymongo import MongoClient
from flask_bcrypt import Bcrypt
from bson.objectid import ObjectId

app = Flask(__name__)
app.secret_key = "supersecretkey"

# DATABASE
client = MongoClient("mongodb://localhost:27017/")
db = client["skillswap"]

bcrypt = Bcrypt(app)

# ---------------- ROUTES ----------------

@app.route("/")
def home():
    if "user" not in session:
        return redirect("/login")
    return render_template("index.html")


@app.route("/resources")
def resources():
    if "user" not in session:
        return redirect("/login")
    return render_template("resource.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact")
def contact():
    return render_template("contact.html")


@app.route("/ai")
def ai():
    return render_template("ai.html")


# ---------------- API ----------------

@app.route("/api/resources")
def api_resources():
    search = request.args.get("search")

    query = {}
    if search:
        query = {
            "$or": [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        }

    resources = db.resources.find(query)

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
            return render_template("login.html", error="Invalid email or password")

    return render_template("login.html")


@app.route("/register", methods=["POST"])
def register():
    email = request.form.get("email")
    password = request.form.get("password")

    if db.users.find_one({"email": email}):
        return "User exists"

    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")

    db.users.insert_one({
        "email": email,
        "password": hashed_pw,
        "name": "",
        "bio": "",
        "skills": []
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


# ---------------- RESOURCE ACTIONS ----------------

@app.route("/add", methods=["POST"])
def add_resource():
    if "user" not in session:
        return jsonify({"error": "Not logged in"}), 401

    db.resources.insert_one({
        "title": request.form.get("title"),
        "description": request.form.get("description"),
        "category": request.form.get("category"),
        "upvotes": 0,
        "comments": [],
        "createdBy": session["user"]
    })

    return jsonify({"message": "Added"})


@app.route("/upvote/<id>")
def upvote(id):
    db.resources.update_one(
        {"_id": ObjectId(id)},
        {"$inc": {"upvotes": 1}}
    )
    return jsonify({"message": "Upvoted"})


@app.route("/comment/<id>", methods=["POST"])
def comment(id):
    text = request.form.get("comment")

    db.resources.update_one(
        {"_id": ObjectId(id)},
        {"$push": {"comments": text}}
    )

    return jsonify({"message": "Comment added"})


# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if "user" not in session:
        return redirect("/login")

    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        # Save to database (optional but good for marks)
        db.messages.insert_one({
            "name": name,
            "email": email,
            "message": message
        })

        return render_template("contact.html", message="Message sent successfully!")

    return render_template("contact.html")