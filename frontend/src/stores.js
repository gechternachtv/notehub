import { writable } from 'svelte/store';

export let localToken = writable(window.localStorage.getItem('pocketbase_auth') ? JSON.parse(window.localStorage.getItem('pocketbase_auth')) : false)

