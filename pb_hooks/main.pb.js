routerAdd("POST", "/meta", (c) => {

    const data = $apis.requestInfo(c).data

    console.log("url:",data.url)

    const res = $http.send({
        url:     data.url,
        method:  "GET",
        body:    "", // eg. JSON.stringify({"test": 123})
        headers: {"content-type": "application/json"},
        timeout: 120, // in seconds
    })
    
        const headRegex = /<head>([\s\S]*?)<\/head>/i;
        const matches = res.raw?.match(headRegex);
        if(matches){
            return c.json(res.statusCode, matches[0])
        }
            
})