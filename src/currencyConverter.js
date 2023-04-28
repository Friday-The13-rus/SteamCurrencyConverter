const russianFormat = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB"
})

function convert(text, rate) {
    if (!text.includes("₸")) {
        return null
    }

    let number = parseFloat(text.replace("₸", "").replace(" ", ""))
    if (number) {
        let result = russianFormat.format(number * rate)
        return result
    }
    return null
}

function convertElements(selector, rate, node) {
    let elements = (node ?? document).querySelectorAll(selector)
    for (let element of elements) {
        let converted = convert(element.innerText, rate)
        if (converted) {
            element.innerText = converted
        }
    }
}

function convertStatic(rate) {
    convertElements(".discount_original_price", rate)
    convertElements(".discount_final_price", rate)
    convertElements(".price", rate)
    convertElements(".your_price > div:nth-child(2)", rate)
    convertElements(".game_area_dlc_price", rate)
    convertElements("#header_wallet_balance", rate)
    convertElements(".steamdb_prices_top > b", rate)
    convertElements(".small_cap > h5", rate)
    convertElements(".bundle_savings", rate)

    convertElements('div[class^="salepreviewwidgets_StoreOriginalPrice_"]', rate)
    convertElements('div[class^="salepreviewwidgets_StoreSalePriceBox_"]', rate)
}

function watchWithObserver(selectors, callback) {
    let mutationObserver = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) {
                    continue;
                }

                callback(node)
            }
        }
    })

    for (let selector of selectors) {
        let elements = document.querySelectorAll(selector.selectors)
        for (let element of elements) {
            mutationObserver.observe(element, selector.options)
        }
    }
}

function watchHomePage(rate) {
    watchWithObserver([
        {
            selectors: ".home_ctn",
            options : {
                subtree: true,
                childList: true
            }
        },
        {
            selectors: "#content_more",
            options: {
                childList: true
            }
        }
    ], (node) => {
        convertElements(".discount_original_price", rate, node)
        convertElements(".discount_final_price", rate, node)
    })
}

function convertSalesElements(node, rate) {
    convertElements('div[class^="salepreviewwidgets_StoreOriginalPrice_"]', rate, node)
    convertElements('div[class^="salepreviewwidgets_StoreSalePriceBox_"]', rate, node)
}

function watchSalesPage(rate) {
    watchWithObserver([
        {
            selectors: ".SaleOuterContainer",
            options: {
                subtree: true,
                childList: true
            }
        }
    ], (node) => {
        convertSalesElements(node, rate)
    })

    watchWithObserver([
        {
            selectors: "body",
            options: {
                childList: true
            }
        }
    ], (node) => {
        if (node.matches('div[class^="hoverposition_HoverPosition_"]')) {
            convertSalesElements(node, rate)
        } 
    })
}

function watchSteamDbBanner(rate) {
    watchWithObserver([
        {
            selectors: "#game_area_purchase",
            options: {
                childList: true
            }
        }
    ], (node) => {
        if (node.matches('.steamdb_prices')) {
            convertElements(".steamdb_prices_top > b", rate, node)
        }
    })
}

function watchWishlist(rate) {
    watchWithObserver([
        {
            selectors: "#wishlist_ctn",
            options: {
                childList: true
            }
        }
    ], (node) => {
        convertElements(".discount_original_price", rate, node)
        convertElements(".discount_final_price", rate, node)
    })
}

browser.storage.local.get()
    .then((item) => {
        console.log(`Currency Converter Loaded. Current Rate ${item.rate}`)
        
        convertStatic(item.rate)
        watchHomePage(item.rate)
        watchSteamDbBanner(item.rate)
        watchSalesPage(item.rate)
        watchWishlist(item.rate)
    })
