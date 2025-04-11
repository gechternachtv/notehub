// import { bulletList } from "@milkdown/prose/schema-list"
// import dateFormat from "./dateFormat"
// import getFile from "./getFile"
// import { pb } from "./pb.js"
import { server } from "./stores"
import { get } from "svelte/store"
// import colorhex from "./colorsnames"

export default async (usergroup, markdownobj, authors, board, fileInputelement = null, currentfile = null) => {



    const fileinputarray = Array.from(fileInputelement.files);








    console.log(fileinputarray)

    const content = markdownobj.json.content
    const mdtext = markdownobj.string


    function stringReplacer(originalString, stringsToRemove = []) {

        const foo = [...stringsToRemove].filter(e => e != "")
        let resultString = originalString
        // console.log("😴")


        foo.forEach(element => {
            resultString = resultString.replaceAll(element, "")
        });

        return resultString;

    }



    console.log(mdtext, content)

    const validateUrl = (url, mainpath = "") => {
        try {

            if (mainpath != "") {
                if (url.startsWith('/')) {

                    const absolute = new URL(mainpath).origin

                    new URL(absolute + url)
                    return absolute + url
                } else {

                    new URL(url)
                    return url
                }
            } else {

                new URL(url)
                return url
            }
        } catch (error) {

            return false
        }
    }
    //  console.log(content)

    const meta = {}


    console.log(fileinputarray)

    const card = {
        // color: "var(--card-bg)",
        imglink: "",
        title: "",
        tags: [],
        link: "",
        text: "",
        favico: "",
        raw: content,
        // file: fileinputarray,
        authors: authors,
        board: board,
        done: 0,
        // datementions: ""
    }



    if (fileinputarray.length) {
        card.file = fileinputarray
    }


    //done percentage
    var totalBoxNumber = 0
    var totalCheckedNumber = 0

    const allBulletLists = content.filter(e => e.type === "bullet_list")

    if (allBulletLists.length) {
        allBulletLists.forEach(bulletList => {
            bulletList.content?.forEach(checkbox => {
                if (checkbox.type === "list_item") {
                    totalBoxNumber += 1

                    if (checkbox.attrs.checked) {
                        totalCheckedNumber += 1
                    }

                }
            })
        })

        console.log("media")
        console.log(totalBoxNumber, totalCheckedNumber)


        if (totalBoxNumber > 0) {
            //is checklist
            const donePercentage = (totalCheckedNumber / totalBoxNumber) * 100;

            if (donePercentage > 0) {
                card.done = Math.floor(donePercentage)
            } else {
                card.done = 1
            }
        } else {
            card.done = 0
        }


    } else {
        card.done = 0
    }



    //paragraph
    const paragraph = content.filter(e => e.type === "paragraph").filter(e => e.content)

    //title
    const heading = content.find(e => e.type === "heading")




    if (heading?.content) {
        card.title = stringReplacer(heading.content[0].text)
    }

    if (paragraph) {

        const words = mdtext.replaceAll("\n", " ").split(" ")
        console.log(words);




        //link-check
        // console.log(texts)
        const url = words?.find(e => e.match(/https?:\/\/[^\s]+/))
        // console.log(url)


        if (url) {
            if (validateUrl(url)) {

                card.link = url

                if (url.endsWith('.png') ||
                    url.endsWith('.jpg') ||
                    url.endsWith('.jpeg') ||
                    url.endsWith('.gif') ||
                    url.endsWith('.bmp') ||
                    url.endsWith('.webp') ||
                    url.endsWith('.svg')) {
                    console.log("IS IMAGE LINK!!!")
                    card.imglink = url
                }
                else {
                    try { //metadata

                        const res = await (await fetch(`${get(server).url}/meta`, {
                            method: "POST",
                            mode: "cors", // no-cors, *cors, same-origin
                            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                            credentials: "same-origin", // include, *same-origin, omit
                            headers: {
                                "Content-Type": "application/json",
                                // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            redirect: "follow", // manual, *follow, error
                            referrerPolicy: "no-referrer",
                            body: JSON.stringify({ url: card.link })
                        })).json()

                        const tempDocument = document.implementation.createHTMLDocument();
                        tempDocument.head.outerHTML = res

                        console.log(res)

                        if (tempDocument.head) {
                            console.log(validateUrl(tempDocument.head.querySelector('link[rel="icon"]')?.getAttribute("href"), card.link))

                            meta.color = tempDocument.head.querySelector('meta[name="theme-color"]')?.getAttribute("content")
                            meta.title = tempDocument.head.querySelector('title')?.innerHTML

                            meta.text = tempDocument.head.querySelector('meta[property="og:description"]')?.getAttribute("content")

                            //favico
                            try {
                                if (validateUrl(tempDocument.head.querySelector('link[rel="icon"]')?.getAttribute("href"), card.link)) {
                                    meta.favico = validateUrl(tempDocument.head.querySelector('link[rel="icon"]')?.getAttribute("href"), card.link)
                                } else if (validateUrl(tempDocument.head.querySelector(`link[rel="shortcut icon"]`)?.getAttribute("href"), card.link)) {
                                    meta.favico = validateUrl(tempDocument.head.querySelector(`link[rel="shortcut icon"]`)?.getAttribute("href"), card.link)
                                }
                            } catch (err) {
                                console.warn(err)
                            }
                            //image
                            try {
                                if (validateUrl(tempDocument?.head?.querySelector('meta[property="og:image"]')?.getAttribute("content"), card.link)) {
                                    meta.img = validateUrl(tempDocument?.head?.querySelector('meta[property="og:image"]')?.getAttribute("content"), card.link)
                                } else if (validateUrl(tempDocument?.head?.querySelector('link[rel="image_src"]')?.getAttribute("content"), card.link)) {
                                    meta.img = validateUrl(tempDocument?.head?.querySelector('link[rel="image_src"]')?.getAttribute("content"), card.link)
                                }
                                console.log(meta.img)
                            } catch (err) {
                                console.warn(err)
                            }

                        }




                    } catch (error) {
                        console.warn(error)
                    }
                }




            }
        }
        //title
        if (card.title === "" && meta.title /*link metadata*/) {
            card.title = meta.title
        }




        //tags
        const tags = []

        const tagWords = words.filter(e => e.startsWith("#"))
        const searchTags = []
        for (let index = 0; index < tagWords.length; index++) {
            const e = tagWords[index];
            // search tag
            const namewithouthash = tagWords[index].replace(/^#/, '')
            const name = namewithouthash.split("-").length > 1 ? namewithouthash.split("-")[0] : namewithouthash
            const color = namewithouthash.split("-").length > 1 ? namewithouthash.split("-")[1] : `#294873`

            searchTags.push({ name: name, color: color, usergroup: usergroup })

        }


        //
        if (searchTags.length) {
            console.log("sending...")
            console.log(searchTags)
            const res = await (await fetch(`${get(server).url}/createtags`, {
                method: "POST",
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                body: JSON.stringify({ tags: searchTags })
            })).json()

            console.log(res)
            card.tags = res
            console.log(card.tags)





        }








        //img
        console.log("all")








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




        const matches = findMatchingEntries(card.raw, d => {
            console.log(d)
            if (typeof d === 'string') {
                if (d.startsWith('data:image/')) {
                    return true
                }
            }
        });


        const imagedataarray = []

        for (let index = 0; index < matches.length; index++) {
            const { parent, keyInParent } = matches[index];

            const imgTitle = 'image';
            const src = parent[keyInParent];
            const imgExtension = src.substring(src.lastIndexOf('.') + 1);

            try {
                const blob = await (await fetch(src)).blob();

                const newfile = new File([blob], `${index + 1}${imgTitle}.${imgExtension}`, {
                    type: blob.type,
                });

                console.log("🤯");
                console.log(newfile);

                parent[keyInParent] = `imagedata[${index}]`

                imagedataarray[index] = newfile; //

            } catch (error) {
                console.error("Error fetching image:", error);
            }
        }


        if (card.file) {
            card.file = [...imagedataarray, ...card.file]
        } else {
            card.file = imagedataarray
        }






        if (meta.img) {
            card.imglink = meta.img
        }
















        //favico
        if (meta.favico) {
            card.favico = meta.favico
        }
        //color
        if (meta.color) {
            card.color = meta.color
        }




        const dataWords = words.filter(e => e.startsWith("$"))
        dataWords.forEach(dataWord => {
            try {
                console.log("🫥")

                const name = dataWord.replace("$", '').split(":")[0]
                const data = dataWord.replace("$", '').split(":")[1]
                // console.log(name, data, card[name], name in card)


                if (name == "done") {
                    card[name] = data;
                    card.text = card.text.replace(dataWord, "")
                }
                if (name == "color") {
                    card[name] = data;
                    card.text = card.text.replace(dataWord, "")
                }


            } catch (error) {
                console.warn(error)
            }

        })


        //text


        const textWithoutStuff = stringReplacer(mdtext, [...dataWords, card.link, (card.link ? "" : card.title), ...card.tags.map(e => `#${e.name}`), ...card.tags.map(e => `-${e.color}`)])
        if (textWithoutStuff.replace(/[^a-zA-Z0-9]/g, '').length > 0) {
            console.log("🫡")
            card.text = textWithoutStuff.substring(0, 150)
        } else if (meta.text) {
            card.text = meta.text.substring(0, 150)
        }

















    }



    //imgtest


    console.log("here:")
    console.log(card)
    return card
}