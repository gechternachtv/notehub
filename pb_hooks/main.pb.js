routerAdd("POST", "/meta", (c) => {

    const data = $apis.requestInfo(c).data

    console.log("url:",data.url)

    if(data.url.includes("twitter")){
        console.log("IS TWEET!");
        const apiUrl = `https://api.linkpreview.net/?q=${data.url}`;


        const res = $http.send({
            url:     apiUrl,
            method:  "GET",
            body:    "",
            headers: {
                'X-Linkpreview-Api-Key': "",
              },
            timeout: 120, // in seconds
        })
        
        console.log(res.json)
        return c.json(res.statusCode, `
           
                <meta name="theme-color" content="#4bacd2"/>
                <title>${res.json.title}</title>
                <meta property="og:description" content="${res.json.description}"/>
                <meta property="og:image" content="${res.json.image}"/>
            
        `)
      
    }else{

        const res = $http.send({
            url:     data.url,
            method:  "GET",
            body:    "", // eg. JSON.stringify({"test": 123})
            headers: {"content-type": "application/json"},
            timeout: 120, // in seconds
        })
        
            // console.log(res.raw)
            const headRegex = /<head>([\s\S]*?)<\/head>/i;
            const matches = res.raw?.match(headRegex);
            if(matches){
                console.log(c.json)
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
