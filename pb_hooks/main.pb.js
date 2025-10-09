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




routerAdd("GET", "/migrate", (c) => {
    const convertarget = []

    function milkdownToTiptap(milkdownJSON) {
        if (!Array.isArray(milkdownJSON)) {
            console.warn("Input is not an array, returning empty array.");
            return [];
        }

        const isTruthy = (v) => v === true || v === "true";
        const isFalsy = (v) => v === false || v === "false";

        function convertNode(node) {
            if (!node || typeof node !== "object" || !node.type) return null;

            switch (node.type) {
                case "heading":
                    return {
                        type: "heading",
                        attrs: { level: Number(node.attrs?.level) || 1 },
                        content: safeMap(node.content, convertNode, true),
                    };

                case "paragraph": {
                    const content = safeMap(node.content, convertNode, true);
                    return content && content.length
                        ? { type: "paragraph", content }
                        : { type: "paragraph" };
                }

                case "text": {
                    const textNode = { type: "text", text: node.text ?? "" };

                    if (Array.isArray(node.marks)) {
                        const marks = [];
                        for (const m of node.marks) {
                            if (!m?.type) continue;
                            if (m.type === "strong") marks.push({ type: "bold" });
                            else if (m.type === "emphasis") marks.push({ type: "italic" });
                            else if (m.type === "link" && m.attrs?.href) {
                                marks.push({
                                    type: "link",
                                    attrs: {
                                        href: m.attrs.href,
                                        class: m.attrs.class ?? null,
                                        rel: m.attrs.rel ?? "noopener noreferrer nofollow",
                                        target: m.attrs.target ?? "_blank",
                                    },
                                });
                            }
                        }
                        if (marks.length > 0) textNode.marks = marks;
                    }

                    return textNode;
                }

                case "bullet_list": {
                    const allCheckedItems =
                        Array.isArray(node.content) &&
                        node.content.every(
                            (li) =>
                                li?.attrs &&
                                (typeof li.attrs.checked === "boolean" ||
                                    isTruthy(li.attrs.checked) ||
                                    isFalsy(li.attrs.checked))
                        );

                    if (allCheckedItems) {
                        return { type: "taskList", content: safeMap(node.content, convertNode, true) };
                    }

                    return { type: "bulletList", content: safeMap(node.content, convertNode, true) };
                }

                case "ordered_list":
                    return {
                        type: "orderedList",
                        attrs: { start: Number(node.attrs?.order) || 1, type: null },
                        content: safeMap(node.content, convertNode, true),
                    };

                case "list_item": {
                    const checkedAttr = node.attrs?.checked;
                    const isTask =
                        typeof checkedAttr === "boolean" ||
                        isTruthy(checkedAttr) ||
                        isFalsy(checkedAttr);

                    if (isTask) {
                        return {
                            type: "taskItem",
                            attrs: { checked: isTruthy(checkedAttr) },
                            content: safeMap(node.content, convertNode, true),
                        };
                    }

                    return {
                        type: "listItem",
                        attrs: { color: null },
                        content: safeMap(node.content, convertNode, true),
                    };
                }

                case "image":
                    return {
                        type: "image",
                        attrs: {
                            src: node.attrs?.src || "",
                            alt: node.attrs?.alt || "",
                            title: node.attrs?.title ?? null,
                            width: null,
                            height: null,
                        },
                    };

                case "code_block":
                    return {
                        type: "codeBlock",
                        attrs: {
                            language: node.attrs?.language || null,
                        },
                        content: [
                            {
                                type: "text",
                                text: node.content?.map((n) => n.text ?? "").join("\n") || "",
                            },
                        ],
                    };

                default:
                    if (node.text) {
                        return { type: "text", text: node.text };
                    }
                    console.warn("Unknown node type:", node.type);
                    return null;
            }
        }

        function safeMap(arr, fn, keepText = false) {
            if (!Array.isArray(arr)) return [];
            const out = [];
            for (const item of arr) {
                const val = fn(item);
                if (val !== null && val !== undefined) out.push(val);
            }
            return out;
        }

        return milkdownJSON
            .map(convertNode)
            .filter(Boolean);
    }


    function processRaw(raw) {
        try {
            const tiptapJSON = milkdownToTiptap(JSON.parse(raw));
            return tiptapJSON
        } catch (error) {
            console.log(error)
        }

    }


    async function processAndStoreRecords() {

        const records = $app.dao().findRecordsByFilter("cards", `raw != ""`);

        for (const record of records) {

            const newValue = processRaw(record.get("raw"));

            record.set("raw", newValue);

            $app.dao().saveRecord(record);


        }
    }

    processAndStoreRecords();


});
