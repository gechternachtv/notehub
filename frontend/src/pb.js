import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_API_URL === "" ? import.meta.env.BASE_URL : import.meta.env.VITE_API_URL);
window.pb = pb;