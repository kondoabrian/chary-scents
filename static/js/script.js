/* =========================================
PRODUCT SEARCH
========================================= */

const searchInput = document.getElementById("productSearch");

if (searchInput) {

```
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
```

}

/* =========================================
CATEGORY FILTER
========================================= */

const filterButtons =
document.querySelectorAll(".filter-btn");

filterButtons.forEach(function (button) {

```
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
```

});

/* =========================================
PRODUCT QUANTITY
========================================= */

function changeQuantity(amount) {

```
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
```

}

/* =========================================
TEMPORARY CART MESSAGE
========================================= */

function addToCart(productName) {

```
alert(
    productName +
    " has been added to your cart."
);
```

}

/* =========================================
COPY WEBSITE LINK
========================================= */

function copyWebsiteLink() {

```
const websiteUrl =
    window.location.origin;

const messageElement =
    document.getElementById("copyMessage");


if (navigator.clipboard) {

    navigator.clipboard.writeText(websiteUrl)

        .then(function () {

            if (messageElement) {

                messageElement.innerHTML =
                    '<i class="bi bi-check-circle-fill"></i> ' +
                    'Website link copied successfully!';

            }

        })

        .catch(function () {

            copyUsingFallback(
                websiteUrl,
                messageElement
            );

        });

} else {

    copyUsingFallback(
        websiteUrl,
        messageElement
    );

}
```

}

/* =========================================
COPY LINK FALLBACK
========================================= */

function copyUsingFallback(
websiteUrl,
messageElement
) {

```
const textArea =
    document.createElement("textarea");

textArea.value = websiteUrl;

textArea.style.position = "fixed";

textArea.style.left = "-999999px";

document.body.appendChild(textArea);

textArea.focus();

textArea.select();


try {

    document.execCommand("copy");

    if (messageElement) {

        messageElement.innerHTML =
            '<i class="bi bi-check-circle-fill"></i> ' +
            'Website link copied successfully!';

    }

} catch (error) {

    if (messageElement) {

        messageElement.innerHTML =
            "Please copy the website address manually.";

    }

}


document.body.removeChild(textArea);
```

}

/* =========================================
SHARE WEBSITE
========================================= */

function shareWebsite() {

```
const websiteUrl =
    window.location.origin;


const shareData = {

    title: "Chary Scents",

    text:
        "Check out Chary Scents - " +
        "Your Beauty, Our Passion.",

    url: websiteUrl

};


if (navigator.share) {

    navigator.share(shareData)

        .catch(function (error) {

            if (error.name !== "AbortError") {

                console.log(
                    "Sharing failed:",
                    error
                );

            }

        });

} else {

    copyWebsiteLink();

}
```

}
