// =========================================
// PRODUCT SEARCH
// =========================================

const searchInput = document.getElementById("productSearch");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const searchText =
            this.value.toLowerCase();

        const products =
            document.querySelectorAll(".product-item");

        products.forEach(function (product) {

            const productName =
                product.innerText.toLowerCase();

            if (productName.includes(searchText)) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });

    });

}


// =========================================
// CATEGORY FILTER
// =========================================

const filterButtons =
    document.querySelectorAll(".filter-btn");


filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const selectedCategory =
            this.dataset.category;


        filterButtons.forEach(function (btn) {

            btn.classList.remove("active");

        });


        this.classList.add("active");


        const products =
            document.querySelectorAll(".product-item");


        products.forEach(function (product) {

            const productCategory =
                product.dataset.category;


            if (
                selectedCategory === "all" ||
                productCategory === selectedCategory
            ) {

                product.style.display = "";

            } else {

                product.style.display = "none";

            }

        });

    });

});


// =========================================
// PRODUCT QUANTITY
// =========================================

function changeQuantity(amount) {

    const quantityElement =
        document.getElementById("quantity");

    if (!quantityElement) {
        return;
    }


    let quantity =
        parseInt(quantityElement.innerText);


    quantity += amount;


    if (quantity < 1) {
        quantity = 1;
    }


    quantityElement.innerText = quantity;
}


// =========================================
// TEMPORARY CART MESSAGE
// =========================================

function addToCart(productName) {

    alert(
        productName +
        " has been added to your cart."
    );

}