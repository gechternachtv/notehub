import { bulletList } from "@milkdown/prose/schema-list"

export default async (content,pb) =>{
    const validateUrl = (url,mainpath = "") => {
        try {
            console.log(mainpath)
            if(mainpath != ""){
                if(url.startsWith('/')){
                    
                    const absolute = new URL(mainpath).origin
                    
                    new URL(absolute + url)
                    return absolute + url 
                }else{
                   
                    new URL(url)
                    return url
                }
            }else{
                
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
    color:"var(--card-bg)",
    img:"",
    title: "",
    tags:[],
    link:"",
    text:"",
    favico: "",
    metadata:{},
    bulletlist:[],
    raw:content
}

const paragraph = content.filter(e => e.type === "paragraph").filter(e => e.content)

//title
const heading = content.find(e => e.type === "heading")
if(heading?.content){
        card.title = heading.content[0].text  
}

if(paragraph){

    const texts = paragraph.filter(e => e.content[0].type === "text")

    //link-check
    // console.log(texts)
    const url = texts?.find(e => e.content[0].text.match(/https?:\/\/[^\s]+/))
    // console.log(url)

    if(url){
        if(validateUrl(url.content[0].text)){
            card.link = url.content[0].text

            try { //metadata
    
            const res = await(await fetch("http://127.0.0.1:8090/meta",{
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
                body:JSON.stringify({url:card.link})
            })).json()

            const tempDocument = document.implementation.createHTMLDocument();
            tempDocument.head.outerHTML = res
            if(tempDocument.head){
                console.log(validateUrl(tempDocument.head.querySelector('link[rel="icon"]')?.getAttribute("href"), card.link))
                
                meta.color = tempDocument.head.querySelector('meta[name="theme-color"]')?.getAttribute("content")
                meta.title = tempDocument.head.querySelector('title')?.innerHTML
                
                meta.text = tempDocument.head.querySelector('meta[property="og:description"]')?.getAttribute("content")
                
                //favico
                
                    if(validateUrl(tempDocument.head.querySelector('link[rel="icon"]')?.getAttribute("href"), card.link)){
                        meta.favico = validateUrl(tempDocument.head.querySelector('link[rel="icon"]')?.getAttribute("href"), card.link)
                    }else if (validateUrl(tempDocument.head.querySelector(`link[rel="shortcut icon"]`)?.getAttribute("href"), card.link)){
                        meta.favico = validateUrl(tempDocument.head.querySelector(`link[rel="shortcut icon"]`)?.getAttribute("href"), card.link)
                    }
                //image
                if(validateUrl(tempDocument?.head?.querySelector('meta[property="og:image"]')?.getAttribute("content"), card.link)){
                    meta.img = validateUrl(tempDocument?.head?.querySelector('meta[property="og:image"]')?.getAttribute("content"), card.link)
                }else if(validateUrl(tempDocument?.head?.querySelector('link[rel="image_src"]')?.getAttribute("content"), card.link)){
                    meta.img = validateUrl(tempDocument?.head?.querySelector('link[rel="image_src"]')?.getAttribute("content"), card.link)
                }
                
            }
            
            


        } catch (error) {
            console.warn(error)
        }
        }
    }
    //title
    if(card.title === "" && meta.title /*link metadata*/){
        card.title = meta.title
    }

    //text


    if(texts.length){
        if(texts[0].content[0].text != card.link && !texts[0].content[0].text.startsWith('#') && !texts[0].content[0].text.startsWith('[')){
            card.text = texts[0].content[0].text
        }else if(texts[1] && !texts[1].content[0].text.startsWith('#')){
            card.text = texts[1].content[0].text
        }else if(meta.text /*link metadata*/){
            card.text = meta.text
        }
    }

    //tags
    const tags = []

    for (let index = 0; index < texts.length; index++) {
        const e = texts[index];
        if(e.content){
            if(e.content[0].text.startsWith('#')){
                // search tag
                    const name = e.content[0].text.replace(/^#/, '')
                    const color = name.split("-").length > 1 ? name.split("-")[1] : `var(--card-bg)`
                    const searchTags = await pb.collection('tags').getList(1, 2, {
                        filter: `created >= "2022-01-01 00:00:00" && name = "${name.split("-")[0]}"`,

                    });
                // console.log(`%c tags:`,"color:turquoise");
                // console.log(searchTags);
                if(searchTags.items[0]){
                    tags.push(searchTags.items[0])
                    console.log(searchTags.items[0]);
                }else{
                    // create tag
                    const data = {
                        "name": `${name.split("-")[0]}`,
                        "color": `${color}`
                    };
                    // console.log(data)
                    const record = await pb.collection('tags').create(data);
                    console.log(record)
                    tags.push(record)
                }
            }

            else if(e.content[0].text.includes('[]')){
                card.check = "islist";
                
            }else if(e.content[0].text.includes('[x]')){
                card.check = "done"
                
            }else{
                card.check = "";
            }
        }

        
    }
    // console.log("redeclaration here:")
    card.tags = tags
    // console.log(tags)


    //img
    const imgEl = paragraph.find(e => e.content?.find(e => e.type).type === "image")
    if(imgEl){
        card.img = imgEl.content[0].attrs.src
    }else if(meta.img){
        card.img = meta.img
    }
    //favico
    if(meta.favico){
        card.favico = meta.favico
    }
    //color
    if(meta.color){
        card.color = meta.color
    }else{
        card.color = `var(--card-bg)`
    }
    
}




    console.log(card)

    return card
}