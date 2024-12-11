//get meta from link

routerAdd("POST", "/meta", (c) => {

    const apikeymodule = require(`${__hooks}/apikey.js`)
    const apikey = process.env.LINKPREVIEW ? process.env.LINKPREVIEW : apikeymodule.get()

    const data = $apis.requestInfo(c).data



    if (data.url.includes("twitter") || data.url.includes("x.com") || data.url.includes("youtu")) {
        const apiUrl = `https://api.linkpreview.net/?q=${data.url}`;


        const res = $http.send({
            url: apiUrl,
            method: "GET",
            body: "",
            headers: {
                'X-Linkpreview-Api-Key': `${apikey}`,
            },
            timeout: 120, // in seconds
        })


        return c.json(res.statusCode, `
                <link rel="icon" href="${(data.url.includes("twitter") || data.url.includes("x.com")) ? "https://chromewebstore.google.com/detail/old-twitter-layout-2024/jgejdcdoeeabklepnkdbglgccjpdgpmf" : "https://www.youtube.com/s/desktop/0c61234c/img/favicon_32x32.png"}" sizes="32x32">
                <meta name="theme-color" content="${(data.url.includes("twitter") || data.url.includes("x.com")) ? `#5eaade` : "#ff0000"}"/>
                <title>${res.json.title}</title>
                <meta property="og:description" content="${res.json.description}"/>
                <meta property="og:image" content="${res.json.image}"/>
            
        `)

    } else {

        const res = $http.send({
            url: data.url,
            method: "GET",
            body: "", // eg. JSON.stringify({"test": 123})
            headers: { "content-type": "application/json" },
            timeout: 120, // in seconds
        })


        const headRegex = /<head>([\s\S]*?)<\/head>/i;
        const matches = res.raw?.match(headRegex);
        if (matches) {

            return c.json(res.statusCode, matches[0])
        }

    }

})

routerAdd("POST", "/createtags", (c) => {
    const data = $apis.requestInfo(c).data

    const returnTags = []


    data.tags.forEach(tag => {
        try {
            const tagrecord = $app.dao().findFirstRecordByFilter(
                "tags", `name = "${tag.name}" && usergroup = "${tag.usergroup}"`)
            console.log(JSON.stringify(tagrecord))
            returnTags.push(tagrecord)
        }
        catch (error) {

            const collection = $app.dao().findCollectionByNameOrId("tags")

            const record = new Record(collection)

            const form = new RecordUpsertForm($app, record)

            const newtagdata = {
                "name": tag.name,
                "color": tag.color,
                "usergroup": tag.usergroup,
            }



            form.loadData(newtagdata)

            form.submit()

            const tagrecord = $app.dao().findFirstRecordByFilter(
                "tags", `name = "${tag.name}" && usergroup = "${tag.usergroup}"`)
            console.log(JSON.stringify(tagrecord))
            returnTags.push(tagrecord)

        }


    })

    return c.json(200, returnTags)
})


onRecordAfterCreateRequest((e) => {

    //board bind
    const boardtoappend = $app.dao().findRecordById("boards", e.record.get("board"))

    if (boardtoappend) {

        const boardtoappendForm = new RecordUpsertForm($app, boardtoappend)
        boardtoappendForm.loadData({
            "cards": [e.record.get("id"), ...boardtoappend.get("cards")],
        })
        boardtoappendForm.submit();

    } else {
        throw new BadRequestError("board must exist")
    }


    //image validation:



    function replaceBase64Src(jsonStr) {
        try {

            console.log(e.record.get("file"))
            const data = JSON.parse(jsonStr);

            let replacedFirst = false

            function replaceSrc(node) {

                if (replacedFirst === false && Array.isArray(node)) {
                    node.forEach(item => replaceSrc(item));
                } else if (node && typeof node === 'object') {
                    Object.keys(node).forEach(key => {
                        if (replacedFirst === false && key === 'src' && typeof node[key] === 'string' && node[key].startsWith('data:image/')) {
                            node[key] = `/api/files/${e.baseCollectionEvent.collection.id}/${e.record.get("id")}/${e.record.get("file")}`;
                            replacedFirst = true
                        } else {
                            replaceSrc(node[key]);
                        }
                    });
                }
            }

            replaceSrc(data);

            return data
        } catch (error) {
            return "Invalid JSON input";
        }
    }


    e.record.set("raw", replaceBase64Src(e.record.get("raw")))


    $app.dao().saveRecord(e.record)





}, "cards")


onRecordBeforeUpdateRequest((e) => {


    const tags = e.record.get("tags")
    const currentCard = $app.dao().findRecordById("cards", e.record.get("id"))

    //card tag validation (no leftover tags)
    if (currentCard.get("tags")?.join(",") != tags?.join(",")) {

        const excludedTags = currentCard.get("tags").filter(element => !tags.includes(element));

        excludedTags?.forEach(excludedtag => {

            const result = $app.dao().findRecordsByFilter(
                "cards", `tags ~ "${excludedtag}"`
            )



            if (result.length === 1) {

                const tagtodelete = $app.dao().findRecordById("tags", excludedtag)
                if (tagtodelete) {

                    const res = $app.dao().deleteRecord(tagtodelete)

                }
            }
        })



    }


    //current board validation
    if (currentCard.get("board") != e.record.get("board")) {

        const oldboard = $app.dao().findRecordById("boards", currentCard.get("board"))
        const newboard = $app.dao().findRecordById("boards", e.record.get("board"))





        const oldboardrecord = $app.dao().findRecordById("boards", oldboard.get("id"))
        const oldboardform = new RecordUpsertForm($app, oldboardrecord)
        oldboardform.loadData({
            "cards": oldboardrecord.get("cards").filter(a => a != e.record.get("id")),
        })
        oldboardform.submit();



        if (!newboard.get("cards").find(a => { a === e.record.get("id") })) {

            const record = $app.dao().findRecordById("boards", newboard.get("id"))
            const form = new RecordUpsertForm($app, record)
            form.loadData({
                "cards": [e.record.get("id"), ...record.get("cards")],
            })
            form.submit();
        }
    }


}, "cards")


//card delete tag validation (no leftover tags)
onRecordBeforeDeleteRequest((e) => {


    const tags = e.record.get("tags")

    tags?.forEach(tag => {

        const result = $app.dao().findRecordsByFilter(
            "cards", `tags ~ "${tag}"`
        )

        if (result.length === 1) {

            const tagtodelete = $app.dao().findRecordById("tags", tag)
            if (tagtodelete) {

                const res = $app.dao().deleteRecord(tagtodelete)

            }
        }
    })

}, "cards")

//tags (no leftovers)
onRecordBeforeDeleteRequest((e) => {
    try {

        $app.dao().expandRecord(e.record, ["cards"], null)


        e.record.expandedAll("cards").forEach(card => {

            card.get("tags").forEach(tag => {
                const result = $app.dao().findRecordsByFilter(
                    "cards", `tags ~ "${tag}"`
                )

                console.log(result)

                result.forEach(cardWithTag => {
                    console.log(JSON.stringify(cardWithTag))
                })

                if (!result.some(a => a.get("board") != e.record.get("id"))) {

                    const tagtodelete = $app.dao().findRecordById("tags", tag)
                    if (tagtodelete) {

                        const res = $app.dao().deleteRecord(tagtodelete)

                    }


                }

            })


        })

    } catch (err) {
        console.log(err)
    }

}, "boards")


onRecordAfterUpdateRequest((e) => {

    // const record = $app.dao().findRecordById("boards", e.record.get("id"))
    $app.dao().expandRecord(e.record, ["cards"], null)


    e.record.expandedAll("cards").forEach(card => {


        if (card.get("board") != e.record.get("id")) {

            const oldboard = $app.dao().findRecordById("boards", card.get("board"))


            const cardform = new RecordUpsertForm($app, card)
            cardform.loadData({
                "board": e.record.get("id"),
            })
            cardform.submit();

            if (oldboard) {
                const oldboardform = new RecordUpsertForm($app, oldboard)
                oldboardform.loadData({
                    "cards": oldboard.get("cards").filter(e => e != card.get("id")),
                })
                oldboardform.submit();
            }




        }
    })

}, "boards")



// onRecordAfterCreateRequest((e) => {
// }, "boards")
