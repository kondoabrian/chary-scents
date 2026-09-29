
import os
import uuid

from dotenv import load_dotenv

from flask import (
    Flask,
    render_template,
    request,
    session,
    redirect,
    url_for
)

import mysql.connector

from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename


# =========================================================
# LOAD LOCAL ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# CREATE FLASK APPLICATION
# =========================================================

app = Flask(__name__)
UPLOAD_FOLDER = os.path.join(
    app.root_path,
    "static",
    "images"
)

ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp"
}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

# =========================================================
# FLASK SECRET KEY
# =========================================================

app.secret_key = os.getenv(
    "SECRET_KEY",
    "local-development-secret-key"
)


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db_connection():

    db_host = os.getenv(
        "DB_HOST",
        "localhost"
    )

    connection_settings = {
        "host": db_host,
        "port": int(
            os.getenv(
                "DB_PORT",
                "3306"
            )
        ),
        "user": os.getenv(
            "DB_USER",
            "root"
        ),
        "password": os.getenv(
            "DB_PASSWORD",
            ""
        ),
        "database": os.getenv(
            "DB_NAME",
            "chary_scents"
        )
    }

    # When the website is running online on Render,
    # connect securely to Aiven using SSL.
    if db_host != "localhost":

        connection_settings["ssl_ca"] = os.getenv(
            "DB_SSL_CA",
            "/etc/secrets/ca.pem"
        )

        connection_settings["ssl_verify_cert"] = True

    return mysql.connector.connect(
        **connection_settings
    )
def allowed_file(filename):

    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# =========================================================
# WHATSAPP PHONE NUMBER FORMATTER
# =========================================================

def format_whatsapp_number(phone):

    if not phone:
        return ""

    # Convert to string first.
    phone = str(phone)

    # Keep digits only.
    #
    # Examples:
    # +256 770 460 959 -> 256770460959
    # 0770-460-959     -> 0770460959
    phone = "".join(
        character
        for character in phone
        if character.isdigit()
    )

    # Uganda local format:
    #
    # 0770460959
    # becomes
    # 256770460959
    if phone.startswith("0"):

        phone = "256" + phone[1:]

    # If the customer enters:
    #
    # 770460959
    #
    # automatically add Uganda country code.
    elif len(phone) == 9:

        phone = "256" + phone

    return phone


# =========================================================
# JINJA WHATSAPP FILTER
# =========================================================

@app.template_filter("whatsapp_number")
def whatsapp_number_filter(phone):

    return format_whatsapp_number(phone)


# =========================================================
# PRODUCTS
# =========================================================

products = [

    {
        "id": 1,
        "name": "Designer Perfume",
        "category": "Perfumes",
        "price": 35000,
        "image": "perfume.jpg",
        "description": (
            "A beautiful long-lasting fragrance "
            "suitable for everyday use."
        )
    },

    {
        "id": 2,
        "name": "Premium Perfume Oil",
        "category": "Perfume Oils",
        "price": 15000,
        "image": "perfume_oil.jpg",
        "description": (
            "Long-lasting fragrance oil "
            "with a beautiful scent."
        )
    },

    {
        "id": 3,
        "name": "Pink Lip Gloss",
        "category": "Lip Gloss",
        "price": 10000,
        "image": "lip_gloss.jpg",
        "description": (
            "Smooth and glossy lip finish "
            "for everyday beauty."
        )
    },

    {
        "id": 4,
        "name": "Classic Lipstick",
        "category": "Lipsticks",
        "price": 12000,
        "image": "lipstick.jpg",
        "description": (
            "Beautiful lipstick "
            "for a confident look."
        )
    },

    {
        "id": 5,
        "name": "Makeup Kit",
        "category": "Makeup",
        "price": 45000,
        "image": "makeup.jpg",
        "description": (
            "A complete beauty kit "
            "for your makeup needs."
        )
    },

    {
        "id": 6,
        "name": "Skincare Set",
        "category": "Skincare",
        "price": 40000,
        "image": "skincare.jpg",
        "description": (
            "Beauty and skincare products "
            "for your daily routine."
        )
    },

    {
        "id": 7,
        "name": "Beauty Gift Set",
        "category": "Gift Sets",
        "price": 55000,
        "image": "gift_set.jpg",
        "description": (
            "A beautiful beauty package "
            "perfect for gifting."
        )
    },

    {
        "id": 8,
        "name": "Beauty Accessories",
        "category": "Accessories",
        "price": 20000,
        "image": "accessories.jpg",
        "description": (
            "Useful and stylish beauty accessories."
        )
    }

]


# =========================================================
# HOME PAGE
# =========================================================

@app.route("/")
def home():

    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM products
        ORDER BY id DESC
        LIMIT 8
        """
    )

    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template(
        "home.html",
        products=products
    )


# =========================================================
# SHOP PAGE
# =========================================================

@app.route("/shop")
def shop():

    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM products
        ORDER BY id ASC
        """
    )

    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template(
        "shop.html",
        products=products
    )


# =========================================================
# PRODUCT DETAILS
# =========================================================
@app.route("/product/<int:product_id>")
def product(product_id):

    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM products
        WHERE id = %s
        """,
        (product_id,)
    )

    selected_product = cursor.fetchone()

    cursor.close()
    connection.close()

    if selected_product is None:

        return "Product not found", 404

    return render_template(
        "product.html",
        product=selected_product
    )

# ABOUT PAGE
@app.route("/about")
def about():

    return render_template(
        "about.html"
    )
# CONTACT PAGE
@app.route(
    "/contact",
    methods=["GET", "POST"]
)
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

        values = (
            name,
            phone,
            email,
            message
        )

        cursor.execute(
            sql,
            values
        )

        connection.commit()

        cursor.close()

        connection.close()

        message_sent = True

    return render_template(
        "contact.html",
        message_sent=message_sent
    )
# ADMIN LOGIN
@app.route(
    "/admin/login",
    methods=["GET", "POST"]
)
def admin_login():

    if request.method == "POST":

        username = request.form.get(
            "username"
        )

        password = request.form.get(
            "password"
        )

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )

        cursor.execute(
            """
            SELECT *
            FROM admins
            WHERE username = %s
            """,
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

            session["admin_username"] = (
                admin["username"]
            )

            return redirect(
                url_for(
                    "admin_messages"
                )
            )

        return render_template(
            "admin_login.html",
            error="Invalid username or password."
        )

    return render_template(
        "admin_login.html"
    )
# ADMIN MESSAGES

@app.route("/admin/messages")
def admin_messages():

    # Prevent people from opening the admin messages
    # page without logging in.
    if not session.get(
        "admin_logged_in"
    ):

        return redirect(
            url_for(
                "admin_login"
            )
        )

    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM messages
        ORDER BY created_at DESC
        """
    )

    messages = cursor.fetchall()

    cursor.close()

    connection.close()

    return render_template(
        "admin_messages.html",
        messages=messages
    )
@app.route("/admin/products")
def admin_products():

    # Only logged-in admins can access this page
    if not session.get("admin_logged_in"):
        return redirect(url_for("admin_login"))

    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )

    cursor.execute(
        """
        SELECT *
        FROM products
        ORDER BY id DESC
        """
    )

    products = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template(
        "admin_products.html",
        products=products
    )

@app.route("/admin/products/add", methods=["GET", "POST"])
def admin_add_product():

    if not session.get("admin_logged_in"):
        return redirect(url_for("admin_login"))

    error = None

    if request.method == "POST":

        name = request.form.get("name", "").strip()
        category = request.form.get("category", "").strip()
        price = request.form.get("price", "").strip()
        description = request.form.get("description", "").strip()

        image = request.files.get("image")

        # ==========================================
        # VALIDATION
        # ==========================================

        if not name:
            error = "Please enter the product name."

        elif not category:
            error = "Please select a category."

        elif not price:
            error = "Please enter the product price."

        elif not image or image.filename == "":
            error = "Please choose a product image."

        elif not allowed_file(image.filename):
            error = "Only PNG, JPG, JPEG and WEBP images are allowed."


        if error:

            return render_template(
                "admin_add_product.html",
                error=error
            )


        # ==========================================
        # CREATE SAFE UNIQUE IMAGE NAME
        # ==========================================

        original_filename = secure_filename(
            image.filename
        )

        extension = original_filename.rsplit(
            ".",
            1
        )[1].lower()

        image_filename = (
            uuid.uuid4().hex
            + "."
            + extension
        )


        # ==========================================
        # SAVE IMAGE
        # ==========================================

        os.makedirs(
            app.config["UPLOAD_FOLDER"],
            exist_ok=True
        )

        image_path = os.path.join(
            app.config["UPLOAD_FOLDER"],
            image_filename
        )

        image.save(image_path)


        # ==========================================
        # SAVE PRODUCT IN DATABASE
        # ==========================================

        connection = get_db_connection()

        cursor = connection.cursor()

        cursor.execute(
            """
            INSERT INTO products
            (
                name,
                category,
                price,
                description,
                image
            )
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                name,
                category,
                price,
                description,
                image_filename
            )
        )

        connection.commit()

        cursor.close()
        connection.close()


        return redirect(
            url_for("admin_products")
        )


    return render_template(
        "admin_add_product.html",
        error=error
    )
# ==========================================================
# ADMIN - EDIT PRODUCT
# ==========================================================

@app.route(
    "/admin/products/edit/<int:product_id>",
    methods=["GET", "POST"]
)
def admin_edit_product(product_id):

    # ------------------------------------------------------
    # ADMIN LOGIN CHECK
    # ------------------------------------------------------

    if not session.get("admin_logged_in"):

        return redirect(
            url_for("admin_login")
        )


    # ------------------------------------------------------
    # GET CURRENT PRODUCT
    # ------------------------------------------------------

    connection = get_db_connection()

    cursor = connection.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT *
        FROM products
        WHERE id = %s
        """,
        (product_id,)
    )


    product = cursor.fetchone()


    cursor.close()
    connection.close()


    # ------------------------------------------------------
    # PRODUCT DOES NOT EXIST
    # ------------------------------------------------------

    if product is None:

        return "Product not found", 404


    # ------------------------------------------------------
    # FORM SUBMITTED
    # ------------------------------------------------------

    if request.method == "POST":

        name = request.form.get(
            "name",
            ""
        ).strip()


        category = request.form.get(
            "category",
            ""
        ).strip()


        price = request.form.get(
            "price",
            ""
        ).strip()


        description = request.form.get(
            "description",
            ""
        ).strip()


        image_file = request.files.get(
            "image"
        )


        # --------------------------------------------------
        # VALIDATE REQUIRED FIELDS
        # --------------------------------------------------

        if (
            not name
            or not category
            or not price
            or not description
        ):

            return render_template(
                "admin_edit_product.html",
                product=product,
                error="Please complete all required fields."
            )


        # --------------------------------------------------
        # VALIDATE PRICE
        # --------------------------------------------------

        try:

            price_value = float(price)


            if price_value < 0:

                raise ValueError


        except ValueError:

            return render_template(
                "admin_edit_product.html",
                product=product,
                error="Please enter a valid product price."
            )


        # --------------------------------------------------
        # KEEP CURRENT IMAGE BY DEFAULT
        # --------------------------------------------------

        image_filename = product["image"]


        # --------------------------------------------------
        # NEW IMAGE SELECTED
        # --------------------------------------------------

        if (
            image_file
            and image_file.filename
        ):


            if not allowed_file(
                image_file.filename
            ):

                return render_template(
                    "admin_edit_product.html",
                    product=product,
                    error=(
                        "Invalid image type. "
                        "Please choose JPG, JPEG, PNG or WEBP."
                    )
                )


            # ----------------------------------------------
            # GET SAFE ORIGINAL FILE NAME
            # ----------------------------------------------

            original_filename = secure_filename(
                image_file.filename
            )


            # ----------------------------------------------
            # GET FILE EXTENSION
            # ----------------------------------------------

            file_extension = (
                original_filename
                .rsplit(".", 1)[1]
                .lower()
            )


            # ----------------------------------------------
            # CREATE UNIQUE FILE NAME
            # ----------------------------------------------

            image_filename = (
                str(uuid.uuid4())
                + "."
                + file_extension
            )


            # ----------------------------------------------
            # SAVE NEW IMAGE
            # ----------------------------------------------

            image_path = os.path.join(
                app.config["UPLOAD_FOLDER"],
                image_filename
            )


            image_file.save(
                image_path
            )


        # --------------------------------------------------
        # UPDATE DATABASE
        # --------------------------------------------------

        connection = get_db_connection()

        cursor = connection.cursor()


        try:

            cursor.execute(
                """
                UPDATE products

                SET
                    name = %s,
                    category = %s,
                    price = %s,
                    description = %s,
                    image = %s

                WHERE id = %s
                """,
                (
                    name,
                    category,
                    price_value,
                    description,
                    image_filename,
                    product_id
                )
            )


            connection.commit()


        except Exception:

            connection.rollback()

            cursor.close()
            connection.close()


            # If we created a new image but database
            # update failed, remove that new image.

            if (
                image_filename
                != product["image"]
            ):

                new_image_path = os.path.join(
                    app.config["UPLOAD_FOLDER"],
                    image_filename
                )


                if os.path.exists(
                    new_image_path
                ):

                    os.remove(
                        new_image_path
                    )


            return render_template(
                "admin_edit_product.html",
                product=product,
                error=(
                    "The product could not be updated. "
                    "Please try again."
                )
            )


        cursor.close()
        connection.close()


        # --------------------------------------------------
        # DELETE OLD UPLOADED IMAGE
        # --------------------------------------------------

        if (
            image_filename
            != product["image"]
        ):


            protected_images = {
                "perfume.jpg",
                "perfume_oil.jpg",
                "lip_gloss.jpg",
                "lipstick.jpg",
                "makeup.jpg",
                "skincare.jpg",
                "gift_set.jpg",
                "accessories.jpg"
            }


            old_image_filename = product[
                "image"
            ]


            if (
                old_image_filename
                and old_image_filename
                not in protected_images
            ):


                old_image_path = os.path.join(
                    app.config["UPLOAD_FOLDER"],
                    old_image_filename
                )


                if os.path.exists(
                    old_image_path
                ):

                    try:

                        os.remove(
                            old_image_path
                        )

                    except OSError:

                        pass


        # --------------------------------------------------
        # RETURN TO PRODUCT MANAGEMENT
        # --------------------------------------------------

        return redirect(
            url_for(
                "admin_products"
            )
        )


    # ------------------------------------------------------
    # GET REQUEST
    # ------------------------------------------------------

    return render_template(
        "admin_edit_product.html",
        product=product
    )
@app.route("/admin/products/delete/<int:product_id>", methods=["POST"])
def admin_delete_product(product_id):

    if not session.get("admin_logged_in"):
        return redirect(url_for("admin_login"))

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Get product first so we know its image filename
    cursor.execute(
        """
        SELECT *
        FROM products
        WHERE id = %s
        """,
        (product_id,)
    )

    product = cursor.fetchone()

    if product is None:
        cursor.close()
        connection.close()

        return redirect(
            url_for("admin_products")
        )


    # Delete product from database
    cursor.execute(
        """
        DELETE FROM products
        WHERE id = %s
        """,
        (product_id,)
    )

    connection.commit()

    cursor.close()
    connection.close()


    # ==========================================
    # DELETE UPLOADED IMAGE FILE
    # ==========================================

    image_filename = product.get("image")

    if image_filename:

        image_path = os.path.join(
            app.config["UPLOAD_FOLDER"],
            image_filename
        )

        # Do not accidentally remove original
        # project images unless you want to.
        protected_images = {
            "perfume.jpg",
            "perfume_oil.jpg",
            "lip_gloss.jpg",
            "lipstick.jpg",
            "makeup.jpg",
            "skincare.jpg",
            "gift_set.jpg",
            "accessories.jpg"
        }

        if (
            image_filename not in protected_images
            and os.path.exists(image_path)
        ):
            os.remove(image_path)


    return redirect(
        url_for("admin_products")
    )
@app.route("/admin/logout")
def admin_logout():

    session.pop(
        "admin_logged_in",
        None
    )

    session.pop(
        "admin_id",
        None
    )

    session.pop(
        "admin_username",
        None
    )

    return redirect(
        url_for(
            "admin_login"
        )
    )


# =========================================================
# RUN FLASK
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5001
    )