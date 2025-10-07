
import { server } from "./stores"
import { get } from "svelte/store"
import findMatchingEntries from "./findMatchingEntriesJSON";


export default async (usergroup, tiptapobj, authors, board, fileInputelement = null, currentfile = []) => {


    // const fileinputarray = Array.from(fileInputelement.files);

    const content = tiptapobj.raw



    function stringReplacer(originalString, stringsToRemove = []) {

        const foo = [...stringsToRemove].filter(e => e != "")
        let resultString = originalString
        foo.forEach(element => {
            resultString = resultString.replaceAll(element, "")
        });

        return resultString;

    }




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




    const card = {
        // color: "var(--card-bg)",
        imglink: "",
        title: "",
        tags: [],
        link: "",
        text: "",
        favico: "",
        raw: content,
        authors: authors,
        board: board,
        done: 0,
        file: currentfile
        // datementions: ""
    }

    //title
    if (tiptapobj.card_title) {
        card.title = tiptapobj.card_title
    }

    //checklist
    let totalCheckedNumber = 0

    const checklistitems = tiptapobj.card_checklistitem

    if (checklistitems?.length) {
        checklistitems.forEach(bulletList => {
            if (bulletList.dataChecked === "true") {
                console.log(bulletList.dataChecked)
                totalCheckedNumber += 1
            }
        })
        const donePercentage = (totalCheckedNumber / checklistitems.length) * 100;

        if (donePercentage > 0) {
            card.done = Math.floor(donePercentage)
        } else {
            card.done = 1
        }
    } else {
        card.done = 0
    }








    if (tiptapobj.card_mainlink) {
        if (validateUrl(tiptapobj.card_mainlink)) {

            card.link = validateUrl(tiptapobj.card_mainlink)

            if (card.link.endsWith('.png') ||
                card.link.endsWith('.jpg') ||
                card.link.endsWith('.jpeg') ||
                card.link.endsWith('.gif') ||
                card.link.endsWith('.bmp') ||
                card.link.endsWith('.webp') ||
                card.link.endsWith('.svg')) {

                card.imglink = card.link
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


                    if (tempDocument.head) {

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




    //data mentions

    if (tiptapobj.card_datementions) {
        card.datementions = tiptapobj.card_datementions.map(e => e.dataDate).toString()
    }






    //tags

    if (tiptapobj.card_tags.length) {
        const oldtags = []
        const newtags = []


        tiptapobj.card_tags.forEach(tag => {
            if (tag.dataTagId) {
                oldtags.push({ name: tag.dataName, id: tag.dataTagId })
            } else {
                newtags.push({ name: tag.dataName })
            }
        })

        //
        if (newtags.length) {

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
                body: JSON.stringify({ usergroup: usergroup, tags: newtags })
            })).json()

            console.log(oldtags, res)
            card.tags = [...oldtags, ...res]


        } else {
            card.tags = oldtags
        }

    }








    //img











    const matches = findMatchingEntries(card.raw, d => {
        if (d) {
            if (typeof d === 'string') {
                if (d.startsWith('data:image/')) {
                    return true
                }
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

            const newfile = new File([blob], `${index}`, {
                type: blob.type,
            });



            parent[keyInParent] = `imagedata[${card.file.length + index}]`

            imagedataarray[index] = newfile; //

        } catch (error) {
            console.error("Error fetching image:", error);
        }
    }




    if (card.file) {
        console.log("cardfile exists")
        card.file = [...card.file, ...imagedataarray]
        console.log(card.file)
    } else {
        card.file = imagedataarray
    }





    if (meta.img) {
        card.imglink = meta.img
    }









    if (card.imglink === "" && card.file?.length === 0) {
        console.log("IMAGES!!!")
        const imagesLinks = findMatchingEntries(card.raw, d => {
            if (d) {
                if (d.type === "image") {

                    return true

                }
            }

        });

        if (imagesLinks.length) {
            console.log(imagesLinks[0])
            if (imagesLinks[0].value?.attrs?.src) {
                if (imagesLinks[0].value.attrs.src.length < 200) {
                    card.imglink = imagesLinks[0].value.attrs.src
                }

            }
        }

    }








    //favico
    if (meta.favico) {
        card.favico = meta.favico
    }
    //color
    if (meta.color) {
        card.color = meta.color
    }




    // const dataWords = words.filter(e => e.startsWith("$"))
    // dataWords.forEach(dataWord => {
    //     try {


    //         const name = dataWord.replace("$", '').split(":")[0]
    //         const data = dataWord.replace("$", '').split(":")[1]

    //         function isNumber(str) {
    //             return !isNaN(str) && str.trim() !== '';
    //         }


    //         if (name == "done") {
    //             if (isNumber(data)) {
    //                 card[name] = Math.floor(Number(data));
    //                 card.text = card.text.replace(dataWord, "")
    //             } else if (data.includes("/")) {
    //                 let [before, after] = data.split("/");
    //                 if (isNumber(before) && isNumber(after) && after != "0") {
    //                     if (Number(after) > Number(before)) {
    //                         const fraction = Number(before) / Number(after);
    //                         const percentage = fraction * 100;
    //                         card[name] = Math.floor(percentage);
    //                     } else {
    //                         card[name] = 100;
    //                     }

    //                     card.text = card.text.replace(dataWord, "")
    //                 }
    //             }

    //         }
    //         if (name == "color") {
    //             card[name] = data;
    //             card.text = card.text.replace(dataWord, "")
    //         }


    //     } catch (error) {
    //         console.warn(error)
    //     }

    // })


    //text


    const textWithoutStuff = stringReplacer(tiptapobj.text, [card.link, (card.link ? "" : card.title), ...card.tags.map(e => `#${e.name}`)])
    if (textWithoutStuff.replace(/[^a-zA-Z0-9]/g, '').length > 0) {
        card.text = textWithoutStuff.substring(0, 150)
    } else if (meta.text) {
        card.text = meta.text.substring(0, 150)
    }





















    //imgtest


    console.log(card)
    return card
}