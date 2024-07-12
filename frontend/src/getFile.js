import { get } from "svelte/store";
import { server } from "./stores";
export default (element) => {
    try {

        const name = element.file
        // console.log(name);

        const suffix = name.split(".")[1].split("?")[0]
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


        return {
            type: fileTypes[suffix],
            link: `${get(server).url}/api/files/${element.collectionId}/${element.id}/${name}`
        }
    } catch (error) {
        console.warn(`error getting filename:`)
        console.warn(element)
        console.warn(error)
    }
}