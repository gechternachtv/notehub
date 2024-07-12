import { get } from "svelte/store";
import { server } from './stores';
import PocketBase from 'pocketbase';

export const pb = new PocketBase(get(server).url);
window.pb = pb;