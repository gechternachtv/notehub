<script>
// @ts-nocheck

import  {pop} from 'svelte-spa-router'
import {pb} from '../pb.js';
import Editor from '../Boardpage/editor.svelte';
import Card from '../Card/card.svelte';
import createNewCard from '../createNewCard.js';

export let params = {}

export let id = params.id;

console.log(id)



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

    console.log(e)

    const card = await createNewCard(e.detail,pb)
    const data = {...card,tags:card.tags.map(e => e.id)};

    // console.log(data)
    const record = await pb.collection('cards').update(cardid, data);
    console.log("%c record:","color:turquoise")
    console.log(record)
    showcard = {...record,tags:card.tags}

}

const handleDelete = async (e)=>{
    await pb.collection('cards').delete(id);
    pop()
}









</script>

<main>



    {#await promise then defaultValue}

        {#if showcard.id}
        <div class="grid">
            <div class="grid-ch"><Card isNew={true} card={showcard}/></div>
            <div class="grid-ch">        
                <Editor defaultValue={defaultValue} on:newcontent={handleNewCard} clearAllonEnter={false}/>
                <div class="editor-panel">
                    <button class="" on:click={()=>{pop()}}>board</button>
                    <button class="button-d" on:click={handleDelete}>delete</button>
                </div>
            </div>
        </div>
        

        {/if}

    {:catch error}
	<p style="color: red">{error.message}</p>
{/await}
</main>

<style>
    main{
        padding:30px;
        box-sizing: border-box;
    }
    button {
                background: var(--button-bg);
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
            .button-d {
                background: var(--alert);
            }
            .grid{
                display:grid;
                grid-template-columns: 1fr 1fr;
                gap:20px;
            }
            .grid-ch{
                max-width:100%;
            }
            .editor-panel{
                display:flex;
                gap:10px;
            }
</style>