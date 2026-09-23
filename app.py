from flask import Flask, render_template

app = Flask(__name__)


# ---------------- HOME ----------------

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

@app.route("/contact")
def contact():
    return render_template("contact.html")


# ---------------- RUN ----------------

if __name__ == "__main__":
    app.run(debug=True)