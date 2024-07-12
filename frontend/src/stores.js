import { writable } from 'svelte/store';

console.log(import.meta.env)
const defaultserver = { url: import.meta.env.VITE_URL, name: import.meta.env.VITE_NAME }

export const currentserver = window.localStorage.getItem("currentserver")

export let server = writable(currentserver ? JSON.parse(currentserver) : defaultserver)

export let localToken = writable(window.localStorage.getItem('pocketbase_auth') ? JSON.parse(window.localStorage.getItem('pocketbase_auth')) : false)


