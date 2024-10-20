// import { bulletList } from "@milkdown/prose/schema-list"
// import dateFormat from "./dateFormat"
// import getFile from "./getFile"
import { pb } from "./pb.js"
import { server } from "./stores"
import { get } from "svelte/store"

export default async (instance, markdownobj, fileInputelement = null, currentfile = null) => {

    console.log(instance)
    const filecontent = fileInputelement?.files ? fileInputelement?.files[0] : null

    const content = markdownobj.json.content
    const mdtext = markdownobj.string


    function stringReplacer(originalString, stringsToRemove = []) {

        const foo = ["[]", "[x]", ...stringsToRemove].filter(e => e != "")
        let resultString = originalString
        // console.log("😴")
        console.log(foo)

        foo.forEach(element => {
            resultString = resultString.replaceAll(element, "")
        });

        console.log(resultString)
        console.log("😬")
        return resultString;

    }



    console.log(mdtext, content)

    const validateUrl = (url, mainpath = "") => {
        try {
            console.log(mainpath)
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
    const card = {
        color: "var(--card-bg)",
        imglink: "",
        title: "",
        tags: [],
        link: "",
        text: "",
        favico: "",
        data: {},
        raw: content,
        created: new Date(),
        file: filecontent ? filecontent : currentfile ? currentfile : null,
        logs: [],
        board: ""
    }



    const paragraph = content.filter(e => e.type === "paragraph").filter(e => e.content)

    //title
    const heading = content.find(e => e.type === "heading")




    if (heading?.content) {
        card.title = stringReplacer(heading.content[0].text)
    }

    if (paragraph) {

        const words = mdtext.replaceAll("\n", " ").split(" ")
        console.log(words);


        // if (words[0] === "[]") {
        //     card.check = "islist";

        // } else if (words[0] === "[x]") {
        //     card.check = "done"

        // } else {
        //     card.check = "";
        // }

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
        for (let index = 0; index < tagWords.length; index++) {
            const e = tagWords[index];

            if (tagWords[index].startsWith('#')) {
                // search tag
                const name = tagWords[index].replace(/^#/, '')
                const color = name.split("-").length > 1 ? name.split("-")[1] : `var(--card-bg)`
                const searchTags = await pb.collection('tags').getList(1, 2, {
                    filter: `name = "${name.split("-")[0]}"`,

                });
                // console.log(`%c tags:`,"color:turquoise");
                // console.log(searchTags);
                if (searchTags.items[0]) {
                    tags.push(searchTags.items[0])
                    console.log(searchTags.items[0]);
                } else {
                    // create tag
                    const data = {
                        "name": `${name.split("-")[0]}`,
                        "color": `${color}`,
                        "instance": instance
                    };
                    // console.log(data)
                    const record = await pb.collection('tags').create(data);
                    console.log(record)
                    tags.push(record)
                }
            }



        }
        card.tags = tags









        //img
        const imgEl = paragraph.find(e => e.content?.find(e => e.type).type === "image")
        if (imgEl) {
            card.imglink = imgEl.content[0].attrs.src
        } else if (meta.img) {
            card.imglink = meta.img
        }
        //favico
        if (meta.favico) {
            card.favico = meta.favico
        }
        //color
        if (meta.color) {
            card.color = meta.color
        } else {
            card.color = `var(--card-bg)`
        }





        const dataWords = words.filter(e => e.startsWith("$"))
        dataWords.forEach(dataWord => {
            try {
                console.log("🫥")

                const name = dataWord.replace("$", '').split(":")[0]
                const data = dataWord.replace("$", '').split(":")[1]
                console.log(name, data, card[name], name in card)

                if (name in card && data != null) {

                    card[name] = data;
                    card.text = card.text.replace(dataWord, "")
                } else {
                    card.data[name] = data
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

    if (card.imglink.includes("data")) {

        try {


            const imgTitle = 'image';
            const imgExtension = card.imglink.substring(card.imglink.lastIndexOf('.') + 1);

            const blob = await (await fetch(card.imglink)).blob()

            const newfile = new File([blob], imgTitle + '.' + imgExtension, { type: blob.type });
            console.log("🤯")
            console.log(newfile)
            card.file = newfile
            card.imglink = ""

            //imgtest
        } catch (error) {
            console.log(error)
        }

    }

    console.log(card)
    return card
}