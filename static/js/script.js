// =========================================================
// CHARY SCENTS - WEBSITE JAVASCRIPT
// =========================================================



// =========================================================
// PRODUCT SEARCH
// =========================================================

function searchProducts() {

    const searchInput =
        document.getElementById("productSearch");


    if (!searchInput) {

        return;

    }


    const searchValue =
        searchInput.value.toLowerCase();


    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    productCards.forEach(
        function(card) {

            const productText =
                card.innerText.toLowerCase();


            const column =
                card.closest(
                    ".col-md-6, .col-lg-3"
                );


            if (!column) {

                return;

            }


            if (
                productText.includes(
                    searchValue
                )
            ) {

                column.style.display =
                    "";

            } else {

                column.style.display =
                    "none";

            }

        }
    );

}



// =========================================================
// CATEGORY FILTER
// =========================================================

function filterProducts(
    category,
    clickedButton
) {

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(
        function(button) {

            button.classList.remove(
                "active"
            );

        }
    );


    if (clickedButton) {

        clickedButton.classList.add(
            "active"
        );

    }


    productCards.forEach(
        function(card) {

            const productCategory =
                card.getAttribute(
                    "data-category"
                );


            const column =
                card.closest(
                    ".col-md-6, .col-lg-3"
                );


            if (!column) {

                return;

            }


            if (
                category === "all" ||
                productCategory === category
            ) {

                column.style.display =
                    "";

            } else {

                column.style.display =
                    "none";

            }

        }
    );

}



// =========================================================
// QUANTITY
// =========================================================

function increaseQuantity() {

    const quantityElement =
        document.getElementById(
            "quantity"
        );


    if (!quantityElement) {

        return;

    }


    let quantity =
        parseInt(
            quantityElement.innerText
        );


    if (isNaN(quantity)) {

        quantity = 1;

    }


    quantity++;


    quantityElement.innerText =
        quantity;

}



function decreaseQuantity() {

    const quantityElement =
        document.getElementById(
            "quantity"
        );


    if (!quantityElement) {

        return;

    }


    let quantity =
        parseInt(
            quantityElement.innerText
        );


    if (isNaN(quantity)) {

        quantity = 1;

    }


    if (quantity > 1) {

        quantity--;

    }


    quantityElement.innerText =
        quantity;

}



// =========================================================
// ADD TO CART
// =========================================================

function addToCart(
    productName
) {

    alert(
        productName +
        " has been added to your cart."
    );

}



// =========================================================
// DEMO PACKAGE / PRODUCT SELECTION
// =========================================================

function selectPackage(
    packageName
) {

    alert(
        packageName +
        " package selected. " +
        "This is currently a demonstration."
    );

}



// =========================================================
// GET WEBSITE URL
// =========================================================

function getWebsiteUrl() {

    return (
        window.location.origin +
        "/"
    );

}



// =========================================================
// COPY WEBSITE LINK
// =========================================================

function copyWebsiteLink() {

    const websiteUrl =
        getWebsiteUrl();


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(
                websiteUrl
            )

            .then(
                function() {

                    showCopyMessage(
                        "✓ Website link copied successfully!"
                    );

                }
            )

            .catch(
                function() {

                    copyUsingFallback(
                        websiteUrl
                    );

                }
            );

    } else {

        copyUsingFallback(
            websiteUrl
        );

    }

}



// =========================================================
// COPY FALLBACK
// =========================================================

function copyUsingFallback(
    websiteUrl
) {

    const textArea =
        document.createElement(
            "textarea"
        );


    textArea.value =
        websiteUrl;


    textArea.style.position =
        "fixed";

    textArea.style.left =
        "-9999px";

    textArea.style.top =
        "0";


    document.body.appendChild(
        textArea
    );


    textArea.focus();

    textArea.select();


    let successful =
        false;


    try {

        successful =
            document.execCommand(
                "copy"
            );

    } catch (error) {

        successful =
            false;

    }


    document.body.removeChild(
        textArea
    );


    if (successful) {

        showCopyMessage(
            "✓ Website link copied successfully!"
        );

    } else {

        showCopyMessage(
            "Copy was not allowed. " +
            "Website link: " +
            websiteUrl
        );

    }

}



// =========================================================
// SHOW COPY MESSAGE
// =========================================================

function showCopyMessage(
    message
) {

    const messageElement =
        document.getElementById(
            "copyMessage"
        );


    if (!messageElement) {

        return;

    }


    messageElement.innerHTML =
        message;


    setTimeout(
        function() {

            messageElement.innerHTML =
                "";

        },
        5000
    );

}



// =========================================================
// OPEN SHARE POPUP
// =========================================================

function openSharePopup() {

    const popup =
        document.getElementById(
            "sharePopup"
        );


    if (!popup) {

        return;

    }


    const websiteUrl =
        getWebsiteUrl();


    const encodedUrl =
        encodeURIComponent(
            websiteUrl
        );


    const shareText =
        "Check out Chary Scents - " +
        "Your Beauty, Our Passion.";


    const encodedText =
        encodeURIComponent(
            shareText
        );



    // =========================================
    // WHATSAPP
    // =========================================

    const whatsapp =
        document.getElementById(
            "shareWhatsApp"
        );


    if (whatsapp) {

        whatsapp.href =
            "https://wa.me/?text=" +
            encodedText +
            "%20" +
            encodedUrl;

    }



    // =========================================
    // FACEBOOK
    // =========================================

    const facebook =
        document.getElementById(
            "shareFacebook"
        );


    if (facebook) {

        facebook.href =
            "https://www.facebook.com/sharer/sharer.php?u=" +
            encodedUrl;

    }



    // =========================================
    // X / TWITTER
    // =========================================

    const twitter =
        document.getElementById(
            "shareTwitter"
        );


    if (twitter) {

        twitter.href =
            "https://twitter.com/intent/tweet?text=" +
            encodedText +
            "&url=" +
            encodedUrl;

    }



    // =========================================
    // TELEGRAM
    // =========================================

    const telegram =
        document.getElementById(
            "shareTelegram"
        );


    if (telegram) {

        telegram.href =
            "https://t.me/share/url?url=" +
            encodedUrl +
            "&text=" +
            encodedText;

    }



    // =========================================
    // EMAIL
    // =========================================

    const email =
        document.getElementById(
            "shareEmail"
        );


    if (email) {

        email.href =
            "mailto:?subject=" +
            encodeURIComponent(
                "Check out Chary Scents"
            ) +
            "&body=" +
            encodedText +
            "%0A%0A" +
            encodedUrl;

    }



    // =========================================
    // SHOW POPUP
    // =========================================

    popup.classList.add(
        "active"
    );


    popup.setAttribute(
        "aria-hidden",
        "false"
    );


    // Stop page from scrolling
    // while popup is open

    document.body.style.overflow =
        "hidden";

}



// =========================================================
// CLOSE SHARE POPUP
// =========================================================

function closeSharePopup() {

    const popup =
        document.getElementById(
            "sharePopup"
        );


    if (!popup) {

        return;

    }


    popup.classList.remove(
        "active"
    );


    popup.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}



// =========================================================
// COPY FROM SHARE POPUP
// =========================================================

function copyFromSharePopup() {

    const websiteUrl =
        getWebsiteUrl();


    if (
        navigator.clipboard &&
        window.isSecureContext
    ) {

        navigator.clipboard
            .writeText(
                websiteUrl
            )

            .then(
                function() {

                    showSharePopupMessage(
                        "✓ Website link copied!"
                    );

                }
            )

            .catch(
                function() {

                    copyPopupUsingFallback(
                        websiteUrl
                    );

                }
            );

    } else {

        copyPopupUsingFallback(
            websiteUrl
        );

    }

}



// =========================================================
// COPY POPUP FALLBACK
// =========================================================

function copyPopupUsingFallback(
    websiteUrl
) {

    const textArea =
        document.createElement(
            "textarea"
        );


    textArea.value =
        websiteUrl;


    textArea.style.position =
        "fixed";

    textArea.style.left =
        "-9999px";

    textArea.style.top =
        "0";


    document.body.appendChild(
        textArea
    );


    textArea.focus();

    textArea.select();


    let successful =
        false;


    try {

        successful =
            document.execCommand(
                "copy"
            );

    } catch (error) {

        successful =
            false;

    }


    document.body.removeChild(
        textArea
    );


    if (successful) {

        showSharePopupMessage(
            "✓ Website link copied!"
        );

    } else {

        showSharePopupMessage(
            "Copy failed. Please copy the URL manually."
        );

    }

}



// =========================================================
// SHOW POPUP MESSAGE
// =========================================================

function showSharePopupMessage(
    message
) {

    const messageElement =
        document.getElementById(
            "sharePopupMessage"
        );


    if (!messageElement) {

        return;

    }


    messageElement.innerHTML =
        message;


    setTimeout(
        function() {

            messageElement.innerHTML =
                "";

        },
        4000
    );

}



// =========================================================
// CLOSE POPUP WITH ESC KEY
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeSharePopup();

        }

    }
);