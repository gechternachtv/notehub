<script>
import {querystring, push} from 'svelte-spa-router'
import PocketBase from 'pocketbase';
import Editor from '../Viewboard/editor.svelte';
import Card from '../Card/card.svelte';
import createNewCard from '../createNewCard';

export let params = {}

export let id = params.id;

console.log(id)
const pb = new PocketBase('http://127.0.0.1:8090');


let showcard = {};
let cardid = ""

const cardget = async()=>{
    if(id){
				try {
				const res = await pb.collection('cards').getOne(id,{expand: 'tags'})
				// console.log(params.get("id"))

                // console.log(res);
                showcard = res
                cardid = res.id
                return {
				type: 'json',
				value: {
						"type": "doc",
						"content": res.raw
						}
			};
                
                }catch(err){
                    console.warn(err)
                }
                
            }   
}
let promise = cardget()



const handleNewCard = async (e)=>{

    

    const card = await createNewCard(e.detail.content,pb)
    const data = {
    "raw": card.raw,
    "title": card.title,
    "link": card.link,
    "color": card.color,
    "img": card.img,
    "text": card.text,
    "tooltip": card.tooltip,
    "tags":card.tags.map(e => e.id)
    };

    // console.log(data)
    const record = await pb.collection('cards').update(cardid, data);
    console.log("%c record:","color:turquoise")
    console.log(record)
    showcard = {...record,tags:card.tags}

}

const handleDelete = async (e)=>{
    await pb.collection('cards').delete(id);
    push("/")
}









</script>

<main>
    {#if showcard.id}
        <Card isNew={true} card={showcard}/>
    {/if}
    
    {#await promise}
    fetching data...
    {:then defaultValue}
        <button class="button-d" on:click={handleDelete}>delete</button>
        <Editor defaultValue={defaultValue} on:newcontent={handleNewCard} clearAllonEnter={false}/>

    {:catch error}
	<p style="color: red">{error.message}</p>
{/await}
</main>

<style>
    .button-d {
                background: var(--alert);
                color: var(--button-color);
                padding: 5px;
                font-weight: bold;
                font-size: 11px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 5px;
                border:0px;
                margin:20px 0;
                cursor:pointer;
            }
</style>