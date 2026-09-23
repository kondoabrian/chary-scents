from flask import Flask, render_template, request, session, redirect, url_for
import mysql.connector
from werkzeug.security import check_password_hash

app = Flask(__name__)
app.secret_key = "change-this-to-a-long-random-secret-key"

# ---------------- HOME ----------------
def get_db_connection():

    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="chary_scents"
    )

    return connection

@app.route("/")
def home():
    return render_template("home.html")


# ---------------- SHOP ----------------

@app.route("/shop")
def shop():
    products = [
        {
            "id": 1,
            "name": "Designer Perfume",
            "category": "Perfumes",
            "price": 35000,
            "image": "perfume.jpg",
            "description": "A beautiful long-lasting fragrance suitable for everyday use."
        },
        {
            "id": 2,
            "name": "Premium Perfume Oil",
            "category": "Perfume Oils",
            "price": 15000,
            "image": "perfume_oil.jpg",
            "description": "Long-lasting fragrance oil with a beautiful scent."
        },
        {
            "id": 3,
            "name": "Pink Lip Gloss",
            "category": "Lip Gloss",
            "price": 10000,
            "image": "lip_gloss.jpg",
            "description": "Smooth and glossy lip finish for everyday beauty."
        },
        {
            "id": 4,
            "name": "Classic Lipstick",
            "category": "Lipsticks",
            "price": 12000,
            "image": "lipstick.jpg",
            "description": "Beautiful lipstick for a confident look."
        },
        {
            "id": 5,
            "name": "Makeup Kit",
            "category": "Makeup",
            "price": 45000,
            "image": "makeup.jpg",
            "description": "A complete beauty kit for your makeup needs."
        },
        {
            "id": 6,
            "name": "Skincare Set",
            "category": "Skincare",
            "price": 40000,
            "image": "skincare.jpg",
            "description": "Beauty and skincare products for your daily routine."
        },
        {
            "id": 7,
            "name": "Beauty Gift Set",
            "category": "Gift Sets",
            "price": 55000,
            "image": "gift_set.jpg",
            "description": "A beautiful beauty package perfect for gifting."
        },
        {
            "id": 8,
            "name": "Beauty Accessories",
            "category": "Accessories",
            "price": 20000,
            "image": "accessories.jpg",
            "description": "Useful and stylish beauty accessories."
        }
    ]

    return render_template("shop.html", products=products)


# ---------------- PRODUCT ----------------

@app.route("/product/<int:product_id>")
def product(product_id):

    products = [
        {
            "id": 1,
            "name": "Designer Perfume",
            "category": "Perfumes",
            "price": 35000,
            "image": "perfume.jpg",
            "description": "A beautiful long-lasting fragrance suitable for everyday use."
        },
        {
            "id": 2,
            "name": "Premium Perfume Oil",
            "category": "Perfume Oils",
            "price": 15000,
            "image": "perfume_oil.jpg",
            "description": "Long-lasting fragrance oil with a beautiful scent."
        },
        {
            "id": 3,
            "name": "Pink Lip Gloss",
            "category": "Lip Gloss",
            "price": 10000,
            "image": "lip_gloss.jpg",
            "description": "Smooth and glossy lip finish for everyday beauty."
        },
        {
            "id": 4,
            "name": "Classic Lipstick",
            "category": "Lipsticks",
            "price": 12000,
            "image": "lipstick.jpg",
            "description": "Beautiful lipstick for a confident look."
        },
        {
            "id": 5,
            "name": "Makeup Kit",
            "category": "Makeup",
            "price": 45000,
            "image": "makeup.jpg",
            "description": "A complete beauty kit for your makeup needs."
        },
        {
            "id": 6,
            "name": "Skincare Set",
            "category": "Skincare",
            "price": 40000,
            "image": "skincare.jpg",
            "description": "Beauty and skincare products for your daily routine."
        },
        {
            "id": 7,
            "name": "Beauty Gift Set",
            "category": "Gift Sets",
            "price": 55000,
            "image": "gift_set.jpg",
            "description": "A beautiful beauty package perfect for gifting."
        },
        {
            "id": 8,
            "name": "Beauty Accessories",
            "category": "Accessories",
            "price": 20000,
            "image": "accessories.jpg",
            "description": "Useful and stylish beauty accessories."
        }
    ]

    selected_product = None

    for product in products:
        if product["id"] == product_id:
            selected_product = product
            break

    if selected_product is None:
        return "Product not found", 404

    return render_template(
        "product.html",
        product=selected_product
    )


# ---------------- ABOUT ----------------

@app.route("/about")
def about():
    return render_template("about.html")


# ---------------- CONTACT ----------------
@app.route("/contact", methods=["GET", "POST"])
def contact():

    message_sent = False

    if request.method == "POST":

        name = request.form.get("name")
        phone = request.form.get("phone")
        email = request.form.get("email")
        message = request.form.get("message")

        connection = get_db_connection()

        cursor = connection.cursor()

        sql = """
            INSERT INTO messages
            (name, phone, email, message)
            VALUES (%s, %s, %s, %s)
        """

        values = (name, phone, email, message)

        cursor.execute(sql, values)

        connection.commit()

        cursor.close()
        connection.close()

        message_sent = True

    return render_template(
        "contact.html",
        message_sent=message_sent
    )
@app.route("/admin/messages")
def admin_messages():

    if not session.get("admin_logged_in"):
        return redirect(url_for("admin_login"))

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT *
        FROM messages
        ORDER BY created_at DESC
    """)

    messages = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template(
        "admin_messages.html",
        messages=messages
    )
@app.route("/admin/login", methods=["GET", "POST"])
def admin_login():

    if request.method == "POST":

        username = request.form.get("username")
        password = request.form.get("password")

        connection = get_db_connection()

        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM admins WHERE username = %s",
            (username,)
        )

        admin = cursor.fetchone()

        cursor.close()
        connection.close()

        if admin and check_password_hash(
            admin["password"],
            password
        ):

            session["admin_logged_in"] = True
            session["admin_id"] = admin["id"]
            session["admin_username"] = admin["username"]

            return redirect(url_for("admin_messages"))

        return render_template(
            "admin_login.html",
            error="Invalid username or password."
        )

    return render_template("admin_login.html")

@app.route("/admin/logout")
def admin_logout():

    session.pop("admin_logged_in", None)

    return redirect(url_for("admin_login"))

if __name__ == "__main__":
    app.run(debug=True)