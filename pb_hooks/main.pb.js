routerAdd("POST", "/meta", (c) => {

    const data = $apis.requestInfo(c).data



    if (data.url.includes("twitter") || data.url.includes("x.com") || data.url.includes("youtu")) {
        const apiUrl = `https://api.linkpreview.net/?q=${data.url}`;


        const res = $http.send({
            url: apiUrl,
            method: "GET",
            body: "",
            headers: {
                'X-Linkpreview-Api-Key': "cc30c453f69296da0c6dff082856c83e",
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

        // console.log(res.raw)
        const headRegex = /<head>([\s\S]*?)<\/head>/i;
        const matches = res.raw?.match(headRegex);
        if (matches) {

            return c.json(res.statusCode, matches[0])
        }

    }

})


// routerAdd("POST", "/getsingle", (c) => {

//     const data = $apis.requestInfo(c).data

//     console.log("url:",data.url)

//     const res = $http.send({
//         url:     data.url,
//         method:  "GET",
//         body:    "", // eg. JSON.stringify({"test": 123})
//         headers: {"content-type": "application/json"},
//         timeout: 120, // in seconds
//     })

//             return c.json(200, res)

// })

// routerAdd("GET", "/getupdates", async (c) => {

//     //console.log(c)

//     console.log("cards:")


//     const result = arrayOf(new DynamicModel({
//         "id":"",
//         "link":""
//     }))

//     $app.dao().db()
//         .newQuery("SELECT id, link FROM cards WHERE link IS NOT NULL AND link != '';")
//         .all(result)

//         console.log(result)

//         const foo = await Promise.all(result.map(async (singlePage) => {
//             console.log(singlePage)
//             console.log(singlePage.link)
//             const request = $http.send({
//                 url:     singlePage.link,
//                 method:  "GET",
//                 body:    "", // eg. JSON.stringify({"test": 123})
//                 headers: {"content-type": "application/json"},
//                 timeout: 120, // in seconds
//             })

//                     return {
//                         model:singlePage,
//                         resopnse:request
//                     }

//         }))

//     return c.json(200, foo)
// })

onRecordBeforeUpdateRequest((e) => {

    // console.log(JSON.stringify(e))

    const tags = e.record.get("tags")
    const currentCards = $app.dao().findRecordById("cards", e.record.get("id"))


    if (currentCards.get("tags")?.join(",") != tags?.join(",")) {

        const excludedTags = currentCards.get("tags").filter(element => !tags.includes(element));

        excludedTags?.forEach(excludedtag => {

            const result = $app.dao().findRecordsByFilter(
                "cards", `tags ~ "${excludedtag}"`
            )
            console.log(result)


            if (result.length === 1) {

                const tagtodelete = $app.dao().findRecordById("tags", excludedtag)
                if (tagtodelete) {

                    const res = $app.dao().deleteRecord(tagtodelete)

                }
            }
        })



    }


}, "cards")


onRecordBeforeDeleteRequest((e) => {
    console.log(e.record)

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
