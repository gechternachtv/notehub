routerAdd("POST", "/meta", (c) => {
    try {
        const apikeymodule = require(`${__hooks}/apikey.js`);
        const apikey = process.env.LINKPREVIEW || apikeymodule.get();
        const data = $apis.requestInfo(c).data;

        if (!data || !data.url) {
            return c.json(400, { error: "Missing URL" });
        }

        const url = data.url.trim();

        if (
            url.includes("twitter") ||
            url.includes("x.com") ||
            url.includes("youtu")
        ) {
            const apiUrl = `https://api.linkpreview.net/?q=${encodeURIComponent(url)}`;

            try {
                const res = $http.send({
                    url: apiUrl,
                    method: "GET",
                    headers: { "X-Linkpreview-Api-Key": apikey },
                    timeout: 60,
                });

                if (!res || res.statusCode !== 200 || !res.json) {
                    return c.json(502, { error: "Failed to fetch preview" });
                }

                const title = res.json.title || "Untitled";
                const description = res.json.description || "";
                const image = res.json.image || "";
                const icon = url.includes("twitter") || url.includes("x.com")
                    ? "https://abs.twimg.com/favicons/twitter.ico"
                    : "https://www.youtube.com/s/desktop/0c61234c/img/favicon_32x32.png";
                const theme = url.includes("twitter") || url.includes("x.com") ? "#5eaade" : "#ff0000";

                return c.json(200, `
                    <link rel="icon" href="${icon}" sizes="32x32">
                    <meta name="theme-color" content="${theme}"/>
                    <title>${title}</title>
                    <meta property="og:description" content="${description}"/>
                    <meta property="og:image" content="${image}"/>
                `);
            } catch (err) {
                return c.json(500, { error: "Failed to reach link preview API", details: err.message });
            }
        }

        if (url.includes("listen") ||
            url.includes("stream") ||
            url.includes("radio") ||
            url.match(/\.(mp3|aac|ogg|pls|m3u|m3u8|asx|wax|ram|wma|flac)(\?|$)/)) {
            return c.json(200, `
                <link rel="icon" href="" sizes="32x32">
                <meta name="theme-color" content="#2a7560"/>
                <title>${url}</title>
                <meta property="og:description" content="(﹙˓ 📟 ˒﹚)"/>
                
            `);
        }

        try {
            const res = $http.send({
                url,
                method: "GET",
                headers: { "User-Agent": "MetaFetcher/1.0" },
                timeout: 15,
            });

            if (res.statusCode === 408 || !res.raw) {
                return c.json(408, { error: "Request timed out or returned no content" });
            }

            const headRegex = /<head[^>]*>([\s\S]*?)<\/head>/i;
            const matches = res.raw.match(headRegex);

            if (matches && matches[0]) {
                return c.json(200, matches[0]);
            } else {
                return c.json(204, { warning: "No <head> found in document" });
            }
        } catch (err) {
            if (err.message.includes("timeout")) {
                return c.json(408, { error: "Request timed out" });
            }
            return c.json(500, { error: "Error fetching URL", details: err.message });
        }

    } catch (err) {
        return c.json(500, { error: "Unexpected server error", details: err.message });
    }
});

routerAdd("POST", "/createtags", (c) => {
    const data = $apis.requestInfo(c).data

    const returnTags = []

    data.tags.forEach(tag => {


        const collection = $app.dao().findCollectionByNameOrId("tags")

        const record = new Record(collection)

        const form = new RecordUpsertForm($app, record)

        const newtagdata = {
            "name": tag.name,
            "color": "rgb(41, 72, 115)",
            "usergroup": data.usergroup,
        }



        form.loadData(newtagdata)

        form.submit()

        const tagrecord = $app.dao().findFirstRecordByFilter(
            "tags", `name = "${tag.name}" && usergroup = "${data.usergroup}"`)
        console.log(JSON.stringify(tagrecord))
        returnTags.push(tagrecord)



    })

    return c.json(200, returnTags)
})

routerAdd("GET", "/validateinvite/:usergroup/:id", (c) => {
    const urlUsergroup = c.pathParam("usergroup");
    const id = c.pathParam("id");
    const authRecord = c.get("authRecord");

    console.log("url usergroup:")
    console.log(urlUsergroup)

    console.log("invite id:")
    console.log(id)

    console.log("user:")
    console.log(authRecord.id)

    if (!authRecord) {
        return c.json(401, { error: "unauthorized" });
    }


    const invites = $app.dao().findRecordsByFilter("usergroup_invites", `id = "${id}"`);
    if (invites.length === 0) {
        return c.json(404, { error: "invite not found" });
    }
    const invite = invites[0];

    console.log(invite)


    const usergroupId = invite.get("usergroup");




    if (invite.get("host") == authRecord.id) {
        return c.json(400, { error: "cannot invite self" });
    }


    if (usergroupId !== urlUsergroup) {
        return c.json(400, { error: "unauthorized" });
    }


    const usergroups = $app.dao().findRecordsByFilter("usergroups", `id = "${usergroupId}"`);
    if (usergroups.length === 0) {
        return c.json(404, { error: "usergroup not found" });
    }
    const usergroup = usergroups[0];


    let users = usergroup.get("users") || [];
    if (typeof users === "string") {
        try {
            users = JSON.parse(users);
        } catch (e) {
            users = [];
        }
    }

    if (!users.includes(invite.get("host"))) {
        return c.json(400, { error: "host not part of usergroup" });
    }


    if (users.includes(authRecord.id)) {
        return c.json(200, {
            success: true,
            message: "user already in group",
            usergroup: usergroupId,
            userId: authRecord.id
        });
    }


    users.push(authRecord.id);
    usergroup.set("users", users);

    const collection = $app.dao().findCollectionByNameOrId("usergroups");
    $app.dao().saveRecord(usergroup)

    return c.json(200, {
        success: true,
        message: "user added to usergroup",
        usergroup: usergroupId,
        userId: authRecord.id
    });
});

onRecordBeforeCreateRequest(async (e) => {
    console.log("1 - Before create hook triggered");

    try {
        const auth = e.httpContext.get("authRecord");
        const usergroup = e.record.get("usergroup");

        if (!auth || !usergroup) {

            return;
        }




        const duplicates = $app.dao().findRecordsByFilter(
            "usergroup_invites",
            `host = "${auth.id}" && usergroup = "${usergroup}"`
        );




        for (const duplicate of duplicates) {

            $app.dao().deleteRecord(duplicate);
        }




        e.record.set("host", auth.id);


    } catch (error) {
        console.error("Error in beforeCreate hook:", error);
        throw error;
    }
}, "usergroup_invites");


routerAdd("GET", "/workspaceget/:id", (c) => {
    const id = c.pathParam("id")

    const boards = $app.dao().findRecordsByFilter(
        "boards", `usergroup = "${id}"`
    )

    const workspaces = $app.dao().findRecordsByFilter(
        "workspaces", `usergroup = "${id}"`
    )


    const boardstrimmed = boards.map(r => ({
        id: r.id,
        name: r.get("name"),
        img: r.get("img"),
        color: r.get("color")
    }));


    const workspacestrimmed = workspaces.map(r => ({
        id: r.id
    }));


    return c.json(200, { boards: boardstrimmed, workspaces: workspacestrimmed })
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

            function findMatchingEntries(obj, matchFn, results = [], parent = null, keyInParent = null) {
                for (const key in obj) {
                    const value = obj[key];

                    if (matchFn(value)) {
                        results.push({
                            key,
                            value,
                            parent: obj,      // Reference to parent
                            keyInParent: key  // Key to use for mutation
                        });
                    }

                    if (value && typeof value === 'object') {
                        findMatchingEntries(value, matchFn, results, obj, key);
                    }
                }
                return results;
            }



            // console.log(e.record.get("file"))
            const data = JSON.parse(jsonStr);

            let replacedFirst = false


            const matches = findMatchingEntries(data, d => {
                if (d) {
                    if (typeof d === 'string') {
                        if (d.startsWith('imagedata[')) {
                            return true
                        }
                    }
                }

            });



            for (let index = 0; index < matches.length; index++) {
                const { parent, keyInParent } = matches[index];

                // const imgTitle = 'image';
                // const src = parent[keyInParent];

                parent[keyInParent] = `/api/files/${e.baseCollectionEvent.collection.id}/${e.record.get("id")}/${e.record.get("file")[(e.record.get("file").length - matches.length) + index]}`
            }




            return data
        } catch (error) {
            return "Invalid JSON input";
        }
    }


    e.record.set("raw", replaceBase64Src(e.record.get("raw")))


    $app.dao().saveRecord(e.record)





}, "cards")

onRecordAfterUpdateRequest((e) => {


    //image validation:



    function replaceBase64Src(jsonStr) {
        try {

            function findMatchingEntries(obj, matchFn, results = [], parent = null, keyInParent = null) {
                for (const key in obj) {
                    const value = obj[key];

                    if (matchFn(value)) {
                        results.push({
                            key,
                            value,
                            parent: obj,      // Reference to parent
                            keyInParent: key  // Key to use for mutation
                        });
                    }

                    if (value && typeof value === 'object') {
                        findMatchingEntries(value, matchFn, results, obj, key);
                    }
                }
                return results;
            }



            // console.log(e.record.get("file"))
            const data = JSON.parse(jsonStr);

            let replacedFirst = false


            const matches = findMatchingEntries(data, d => {
                if (d) {
                    if (typeof d === 'string') {
                        if (d.startsWith('imagedata[')) {
                            return true
                        }
                    }
                }

            });



            for (let index = 0; index < matches.length; index++) {
                const { parent, keyInParent } = matches[index];

                // const imgTitle = 'image';
                // const src = parent[keyInParent];

                parent[keyInParent] = `/api/files/${e.baseCollectionEvent.collection.id}/${e.record.get("id")}/${e.record.get("file")[(e.record.get("file").length - matches.length) + index]}`
            }




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

                // console.log(result)

                // result.forEach(cardWithTag => {
                //     console.log(JSON.stringify(cardWithTag))
                // })

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


