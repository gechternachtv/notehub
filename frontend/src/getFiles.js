import { get } from "svelte/store";
import { server } from "./stores";
export default (element) => {
    try {


        const filearr = element.file
        console.log(filearr);

        if (filearr.length) {

            const fileTypes = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/jpeg',
                'gif': 'image/jpeg',
                'webp': 'image/jpeg',
                'txt': 'text',
                'json': 'JSON',
                'mp4': 'Video',
                'avi': 'Video',
                'mov': 'Video',
                'wmv': 'Video',
                'mkv': 'Video',
                'webm': 'Video',
                'flv': 'Video',
                'mp3': 'Audio',
                'wav': 'Audio',
                'aac': 'Audio',
                'ogg': 'Audio',
                'wma': 'Audio'
            };

            return filearr.map(el => {
                if (el.split.length > 1) {
                    const suffix = el.split(".")[1].split("?")[0]
                    return {
                        type: fileTypes[suffix],
                        link: `${get(server).url}/api/files/${element.collectionId}/${element.id}/${el}`
                    }
                }

            });





        }


    } catch (error) {
        console.warn(`error getting filename:`)
        console.warn(element)
        console.warn(error)
    }
}