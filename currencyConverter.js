let russianFormat = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB"
})

function convert(text, rate) {
    if (!text.includes("₸")) {
        return null
    }

    var number = parseFloat(text.replace("₸", "").replace(" ", ""))
    if (number) {
        var result = russianFormat.format(number * rate)
        return result
    }
    return null
}

function convertElements(selector, rate) {
    var elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
        var converted = convert(element.innerText, rate)
        if (converted) {
            element.innerText = converted
        }
    })
}

browser.storage.local.get()
    .then((item) => {
        console.log(`Currency Converter Loaded. Current Rate ${item.rate}`)
        setTimeout(function() {
            convertElements(".discount_original_price", item.rate)
            convertElements(".discount_final_price", item.rate)
            convertElements(".price", item.rate)
            convertElements(".game_area_dlc_price", item.rate)
            convertElements("#header_wallet_balance", item.rate)
            convertElements(".steamdb_prices_top > b", item.rate)
            convertElements(".small_cap > h5", item.rate)
        }, 1000)
    })
