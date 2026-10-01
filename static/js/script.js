// ==========================================================
// CHARRY SCENTS JAVASCRIPT
// ==========================================================


// ==========================================================
// PWA INSTALLATION
// ==========================================================

// The browser stores the installation prompt here when
// Charry Scents becomes installable.

let deferredInstallPrompt = null;


// ==========================================================
// CHECK WHETHER APP IS ALREADY INSTALLED
// ==========================================================

function isCharryScentsInstalled() {

    // Android / Chrome / Edge installed PWA.

    if (
        window.matchMedia(
            "(display-mode: standalone)"
        ).matches
    ) {

        return true;

    }


    // iPhone / iPad installed web app.

    if (
        window.navigator.standalone === true
    ) {

        return true;

    }


    return false;

}



// ==========================================================
// DETECT IOS
// ==========================================================

function isIOSDevice() {

    return /iphone|ipad|ipod/i.test(
        window.navigator.userAgent
    );

}



// ==========================================================
// SHOW INSTALL BUTTON
// ==========================================================

function showInstallAppButton() {

    const installButton =
        document.getElementById(
            "installAppButton"
        );


    if (!installButton) {
        return;
    }


    if (isCharryScentsInstalled()) {

        installButton.style.display =
            "none";

        return;

    }


    installButton.style.display =
        "inline-flex";

}



// ==========================================================
// HIDE INSTALL BUTTON
// ==========================================================

function hideInstallAppButton() {

    const installButton =
        document.getElementById(
            "installAppButton"
        );


    if (!installButton) {
        return;
    }


    installButton.style.display =
        "none";

}



// ==========================================================
// SHOW INSTALL MESSAGE
// ==========================================================

function showInstallAppMessage(
    message
) {

    const messageElement =
        document.getElementById(
            "installAppMessage"
        );


    if (!messageElement) {
        return;
    }


    messageElement.textContent =
        message;


    setTimeout(
        function() {

            messageElement.textContent =
                "";

        },
        8000
    );

}



// ==========================================================
// BROWSER SAYS THE PWA CAN BE INSTALLED
// ==========================================================

window.addEventListener(
    "beforeinstallprompt",
    function(event) {

        // Stop the browser from immediately showing
        // its own installation prompt.

        event.preventDefault();


        // Save the event so our Install App button
        // can trigger it later.

        deferredInstallPrompt =
            event;


        console.log(
            "Charry Scents is ready to install."
        );


        showInstallAppButton();

    }
);



// ==========================================================
// INSTALL CHARRY SCENTS APP
// ==========================================================

async function installCharryScentsApp() {

    // ------------------------------------------------------
    // APP ALREADY INSTALLED
    // ------------------------------------------------------

    if (isCharryScentsInstalled()) {

        hideInstallAppButton();

        showInstallAppMessage(
            "Charry Scents is already installed on this device."
        );

        return;

    }


    // ------------------------------------------------------
    // NORMAL PWA INSTALL PROMPT
    // Chrome / Edge / Android
    // ------------------------------------------------------

    if (deferredInstallPrompt) {

        try {

            deferredInstallPrompt.prompt();


            const choiceResult =
                await deferredInstallPrompt.userChoice;


            if (
                choiceResult.outcome ===
                "accepted"
            ) {

                console.log(
                    "Charry Scents installation accepted."
                );


                showInstallAppMessage(
                    "Installing Charry Scents..."
                );


                hideInstallAppButton();

            } else {

                console.log(
                    "Charry Scents installation cancelled."
                );


                showInstallAppMessage(
                    "Installation cancelled. You can install the app later."
                );

            }


            deferredInstallPrompt =
                null;


        } catch (error) {

            console.error(
                "Unable to open installation prompt:",
                error
            );


            showInstallAppMessage(
                "Unable to open the installation window. Please use your browser menu and choose Install App."
            );

        }


        return;

    }


    // ------------------------------------------------------
    // IPHONE / IPAD
    // ------------------------------------------------------

    if (isIOSDevice()) {

        showInstallAppMessage(
            "To install Charry Scents on iPhone: tap the Share button in Safari, then choose Add to Home Screen."
        );

        return;

    }


    // ------------------------------------------------------
    // INSTALL PROMPT NOT AVAILABLE
    // ------------------------------------------------------

    showInstallAppMessage(
        "To install Charry Scents, open your browser menu and choose Install App or Add to Home screen."
    );

}



// ==========================================================
// APP SUCCESSFULLY INSTALLED
// ==========================================================

window.addEventListener(
    "appinstalled",
    function() {

        console.log(
            "Charry Scents was installed successfully."
        );


        deferredInstallPrompt =
            null;


        hideInstallAppButton();


        showInstallAppMessage(
            "✓ Charry Scents installed successfully!"
        );

    }
);



// ==========================================================
// PRODUCT SEARCH
// ==========================================================

function searchProducts() {

    const searchInput =
        document.getElementById("productSearch");

    if (!searchInput) {
        return;
    }


    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();


    applyProductFilters(searchValue);

}



// ==========================================================
// CATEGORY FILTER
// ==========================================================

let selectedCategory = "all";


function filterProducts(
    category,
    clickedButton
) {

    selectedCategory = category;


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


    const searchInput =
        document.getElementById(
            "productSearch"
        );


    let searchValue = "";


    if (searchInput) {

        searchValue =
            searchInput.value
                .toLowerCase()
                .trim();

    }


    applyProductFilters(
        searchValue
    );

}



// ==========================================================
// APPLY SEARCH + CATEGORY FILTER TOGETHER
// ==========================================================

function applyProductFilters(
    searchValue = ""
) {

    const productCards =
        document.querySelectorAll(
            ".product-card"
        );


    let visibleProducts = 0;


    productCards.forEach(
        function(card) {


            // Search through all text shown in the product card.
            // This includes product name, category,
            // description and price.

            const productText =
                card.innerText
                    .toLowerCase();


            // Get product category from:
            // data-category="{{ product.category }}"

            const productCategory =
                (
                    card.getAttribute(
                        "data-category"
                    ) || ""
                )
                .toLowerCase();


            const wantedCategory =
                selectedCategory
                    .toLowerCase();


            // Check search text.

            const matchesSearch =
                searchValue === "" ||
                productText.includes(
                    searchValue
                );


            // Check selected category.

            const matchesCategory =
                wantedCategory === "all" ||
                productCategory ===
                wantedCategory;


            // Find the Bootstrap column containing
            // this product card.

            const column =
                card.closest(
                    ".product-item"
                ) ||
                card.closest(
                    ".col-md-6"
                ) ||
                card.closest(
                    ".col-lg-3"
                ) ||
                card.parentElement;


            if (!column) {
                return;
            }


            if (
                matchesSearch &&
                matchesCategory
            ) {

                column.style.display = "";

                visibleProducts++;

            } else {

                column.style.display =
                    "none";

            }

        }
    );


    updateNoProductsMessage(
        visibleProducts
    );

}



// ==========================================================
// SHOW MESSAGE WHEN SEARCH FINDS NOTHING
// ==========================================================

function updateNoProductsMessage(
    visibleProducts
) {

    const message =
        document.getElementById(
            "noProductsMessage"
        );


    if (!message) {
        return;
    }


    if (visibleProducts === 0) {

        message.style.display =
            "block";

    } else {

        message.style.display =
            "none";

    }

}



// ==========================================================
// CLEAR SEARCH AND SHOW ALL PRODUCTS
// ==========================================================

function clearProductSearch() {

    const searchInput =
        document.getElementById(
            "productSearch"
        );


    // Clear search box.

    if (searchInput) {

        searchInput.value = "";

    }


    // Return category to All.

    selectedCategory = "all";


    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(
        function(button) {

            button.classList.remove(
                "active"
            );


            if (
                button.getAttribute(
                    "data-category"
                ) === "all"
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );


    // Show every product again.

    applyProductFilters("");


    // Put cursor back into search box.

    if (searchInput) {

        searchInput.focus();

    }

}



// ==========================================================
// PRODUCT QUANTITY
// ==========================================================

function changeQuantity(
    amount
) {

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


    quantity =
        quantity + amount;


    // Quantity cannot be below 1.

    if (quantity < 1) {

        quantity = 1;

    }


    quantityElement.innerText =
        quantity;

}



// ==========================================================
// OLD QUANTITY FUNCTIONS
// ==========================================================
// These are kept so any older buttons
// on the website still continue working.

function increaseQuantity() {

    changeQuantity(1);

}


function decreaseQuantity() {

    changeQuantity(-1);

}



// ==========================================================
// ADD TO CART
// ==========================================================

function addToCart(
    productName
) {

    const quantityElement =
        document.getElementById(
            "quantity"
        );


    let quantity = 1;


    if (quantityElement) {

        const selectedQuantity =
            parseInt(
                quantityElement.innerText
            );


        if (
            !isNaN(
                selectedQuantity
            )
        ) {

            quantity =
                selectedQuantity;

        }

    }


    alert(
        quantity +
        " × " +
        productName +
        " added to your cart."
    );

}



// ==========================================================
// PACKAGE SELECTION
// ==========================================================

function selectPackage(
    packageName
) {

    alert(
        packageName +
        " package selected. " +
        "This is currently a demonstration."
    );

}



// ==========================================================
// GET WEBSITE URL
// ==========================================================

function getWebsiteUrl() {

    return (
        window.location.origin +
        "/"
    );

}



// ==========================================================
// COPY WEBSITE LINK
// ==========================================================

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



// ==========================================================
// COPY WEBSITE FALLBACK
// ==========================================================

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



// ==========================================================
// SHOW COPY MESSAGE
// ==========================================================

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



// ==========================================================
// OPEN SHARE POPUP
// ==========================================================

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
        "Check out Charry Scents - " +
        "Your Beauty, Our Passion.";


    const encodedText =
        encodeURIComponent(
            shareText
        );



    // ======================================================
    // WHATSAPP
    // ======================================================

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



    // ======================================================
    // FACEBOOK
    // ======================================================

    const facebook =
        document.getElementById(
            "shareFacebook"
        );


    if (facebook) {

        facebook.href =
            "https://www.facebook.com/sharer/sharer.php?u=" +
            encodedUrl;

    }



    // ======================================================
    // X / TWITTER
    // ======================================================

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



    // ======================================================
    // TELEGRAM
    // ======================================================

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



    // ======================================================
    // EMAIL
    // ======================================================

    const email =
        document.getElementById(
            "shareEmail"
        );


    if (email) {

        email.href =
            "mailto:?subject=" +
            encodeURIComponent(
                "Check out Charry Scents"
            ) +
            "&body=" +
            encodedText +
            "%0A%0A" +
            encodedUrl;

    }



    // ======================================================
    // SHOW POPUP
    // ======================================================

    popup.classList.add(
        "active"
    );


    popup.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}



// ==========================================================
// CLOSE SHARE POPUP
// ==========================================================

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



// ==========================================================
// COPY LINK FROM SHARE POPUP
// ==========================================================

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



// ==========================================================
// COPY POPUP FALLBACK
// ==========================================================

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



// ==========================================================
// SHOW SHARE POPUP MESSAGE
// ==========================================================

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



// ==========================================================
// CLOSE SHARE POPUP WITH ESC KEY
// ==========================================================

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



// ==========================================================
// INITIALIZE WEBSITE FEATURES
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {


        // ==================================================
        // PWA INSTALL BUTTON
        // ==================================================

        if (
            isCharryScentsInstalled()
        ) {

            hideInstallAppButton();

        } else if (
            deferredInstallPrompt
        ) {

            showInstallAppButton();

        } else if (
            isIOSDevice()
        ) {

            // iOS does not provide beforeinstallprompt.
            // We still show the button so we can explain
            // how to use Safari's Add to Home Screen.

            showInstallAppButton();

        }


        // ==================================================
        // PRODUCT SEARCH
        // ==================================================

        const searchInput =
            document.getElementById(
                "productSearch"
            );


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                searchProducts
            );

        }


        // ==================================================
        // START SHOP WITH ALL PRODUCTS
        // ==================================================

        if (
            document.querySelector(
                ".product-card[data-category]"
            )
        ) {

            applyProductFilters("");

        }

    }
);