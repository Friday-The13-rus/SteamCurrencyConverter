browser.storage.local.get()
    .then((value) => {
        var item = value as StorageData;
        var now = new Date()
        if (item && (now.getTime() - item.date.getTime() < 1000 * 60 * 60 * 24)) {
            console.log(`Up to date. Current rate ${item.rate}`)
            return
        }

        console.log("Updating...")

        fetch("https://open.er-api.com/v6/latest/KZT")
            .then((responce) => responce.json())
            .then((responce) => {
                var rate = responce.rates.RUB
                console.log(`Updated to ${rate}`)

                browser.storage.local.set(new StorageData(now, rate))
            })
    })